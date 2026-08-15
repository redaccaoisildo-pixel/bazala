-- 0007 — Pagamentos ao anfitrião
--
-- Pagar em meticais, para o M-Pesa, em 24 horas é a única vantagem que uma
-- plataforma sul-africana não consegue copiar sem se estabelecer em Moçambique
-- (blueprint §3.4). Um pagamento atrasado, num mercado deste tamanho, é um
-- acontecimento reputacional — daí o SLA ser medido (§13).
--
-- Vem antes de `bookings` porque bookings referencia payouts.

create table payouts (
  id             uuid primary key default gen_random_uuid(),
  host_id        uuid not null references users(id),
  amount         numeric(12,2) not null check (amount > 0),
  currency       char(3) not null default 'MZN',
  method         payout_method not null,

  -- Destino mascarado em qualquer log. Nunca registar o número completo fora
  -- desta coluna.
  destination    text not null,

  status         payout_status not null default 'pending',
  psp_reference  text,
  initiated_at   timestamptz,
  completed_at   timestamptz,
  failure_reason text,
  created_at     timestamptz not null default now(),

  constraint completed_has_timestamp
    check (status <> 'completed' or completed_at is not null),
  constraint failed_has_reason
    check (status <> 'failed' or failure_reason is not null)
);

create index payouts_host_idx on payouts (host_id, created_at desc);
create index payouts_pending_idx on payouts (status) where status in ('pending', 'processing');
