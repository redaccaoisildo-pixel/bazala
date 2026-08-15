-- 0010 — Ledger e histórico de reservas
--
-- Sem Stripe Connect não há divisão automática de comissão, por isso a divisão
-- vive na aplicação (blueprint §7.2). Isso obriga a um ledger a sério: uma
-- coluna `platform_commission` numa reserva não consegue representar um
-- reembolso parcial, um estorno, um anfitrião fundador a 0%, nem uma linha de
-- IVA — e as quatro coisas acontecem no primeiro mês.
--
-- Regra: números financeiros saem SEMPRE daqui, nunca de `bookings`.

create table ledger_entries (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  payout_id  uuid references payouts(id),
  entry_type ledger_entry_type not null,
  amount     numeric(12,2) not null,
  currency   char(3) not null default 'MZN',
  -- Data em que o lançamento conta para efeitos fiscais. Pode divergir de
  -- created_at quando se corrige algo depois do fecho do mês.
  booked_on  date not null default current_date,
  metadata   jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index ledger_booking_idx on ledger_entries (booking_id);
create index ledger_type_month_idx on ledger_entries (entry_type, booked_on);

comment on table ledger_entries is
  'Partida dobrada. As declarações de IVA são uma consulta a esta tabela, não '
  'uma reconstrução a partir das reservas.';

-- Toda a mudança de estado de uma reserva, para disputas. Num mercado pequeno
-- a única defesa credível numa discussão é o registo.
create table booking_events (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  actor_id   uuid references users(id),
  event      text not null,
  payload    jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index booking_events_booking_idx on booking_events (booking_id, created_at);
