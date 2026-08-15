-- 0009 — Reservas
--
-- Duas coisas aqui não são negociáveis.
--
-- 1. A decomposição do dinheiro fecha por CONSTRAINT, não por convenção. A
--    blueprint original tinha `total_price` / `platform_commission` /
--    `host_payout` com descrições que se contradiziam (18% no texto, 90% para
--    o anfitrião no schema). Aqui a aritmética é verificada pela base de dados.
--
-- 2. O IVA é um campo de primeira classe, com marcador de tratamento, para que
--    as reservas de hóspede estrangeiro potencialmente isentas sejam
--    distinguíveis na altura da declaração (blueprint §6.2).

create table bookings (
  id                  uuid primary key default gen_random_uuid(),
  reference           text not null unique,   -- legível por humanos, ex. BZ-4F92K
  guest_id            uuid not null references users(id),
  listing_id          uuid references listings(id),
  experience_id       uuid references experiences(id),

  check_in            date not null,
  check_out           date not null,
  guests_count        int not null check (guests_count > 0),

  currency            char(3) not null default 'MZN',
  fx_rate_usd         numeric(12,6),  -- fixado no momento da reserva
  fx_rate_zar         numeric(12,6),

  accommodation_total numeric(12,2) not null check (accommodation_total > 0),
  guest_fee           numeric(12,2) not null check (guest_fee >= 0),
  guest_total         numeric(12,2) not null,
  host_fee            numeric(12,2) not null check (host_fee >= 0),
  host_payout_amount  numeric(12,2) not null,
  commission_gross    numeric(12,2) not null,
  iva_amount          numeric(12,2) not null check (iva_amount >= 0),
  iva_treatment       iva_treatment not null default 'standard',

  -- Taxas aplicadas, copiadas no momento da reserva. Sem isto, mudar de fase
  -- reescreveria a história de todas as reservas anteriores.
  applied_host_rate   numeric(5,4) not null,
  applied_guest_rate  numeric(5,4) not null,

  status              booking_status not null default 'pending',
  payment_status      payment_status not null default 'unpaid',
  psp_reference       text,
  payout_id           uuid references payouts(id),

  cancellation_policy cancellation_policy not null,
  cancelled_at        timestamptz,
  cancellation_reason text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint checkout_after_checkin check (check_out > check_in),
  constraint listing_xor_experience check (
    (listing_id is not null and experience_id is null) or
    (listing_id is null and experience_id is not null)
  ),
  constraint guest_total_reconciles
    check (guest_total = accommodation_total + guest_fee),
  constraint host_payout_reconciles
    check (host_payout_amount = accommodation_total - host_fee),
  constraint commission_reconciles
    check (commission_gross = guest_fee + host_fee),
  constraint cancelled_has_timestamp
    check (status <> 'cancelled' or cancelled_at is not null)
);

-- Intervalo da estadia, meio-aberto: a saída de um hóspede e a entrada do
-- seguinte no mesmo dia não colidem.
alter table bookings
  add column stay daterange
    generated always as (daterange(check_in, check_out, '[)')) stored;

-- Impede reserva dupla ao nível da base de dados. Verificação na aplicação não
-- chega sob concorrência: dois pedidos simultâneos passam ambos pelo SELECT
-- antes de qualquer um fazer INSERT.
alter table bookings
  add constraint no_double_booking
  exclude using gist (listing_id with =, stay with &&)
  where (status in ('pending', 'confirmed'));

create index bookings_guest_idx on bookings (guest_id, created_at desc);
create index bookings_listing_idx on bookings (listing_id, check_in);
create index bookings_payout_idx on bookings (payout_id) where payout_id is not null;
create index bookings_awaiting_payout_idx
  on bookings (check_in)
  where status = 'confirmed' and payout_id is null;
