-- 0006 — Taxas de comissão por anfitrião
--
-- A comissão tem de ser DADOS, não uma constante no código (blueprint §7.3).
-- Com três fases (§4.2) e uma taxa de fundador (§4.4), uma constante obrigaria
-- a um deploy por cada mudança de fase e tornaria o histórico irreconstituível
-- na altura de fechar contas.
--
-- O total é sempre 16%. O que muda é a repartição:
--   Fase 1 — 5% anfitrião + 11% hóspede   (sem procura provada)
--   Fase 2 — 9% anfitrião +  6% hóspede   (>30% das reservas do anfitrião)
--   Fase 3 — 16% anfitrião + 0% hóspede   (procura dominante)
-- Fundadores — 0% nas primeiras 25 reservas, depois 3% para sempre.

create table host_commission_rates (
  id             uuid primary key default gen_random_uuid(),
  host_id        uuid not null references users(id) on delete cascade,
  host_rate      numeric(5,4) not null check (host_rate >= 0 and host_rate < 1),
  guest_rate     numeric(5,4) not null check (guest_rate >= 0 and guest_rate < 1),
  effective_from date not null default current_date,
  effective_to   date,
  reason         text not null,  -- founding | phase_1 | phase_2 | phase_3 | negotiated
  created_at     timestamptz not null default now(),

  constraint valid_period check (effective_to is null or effective_to > effective_from)
);

-- Um anfitrião não pode ter dois períodos de taxa sobrepostos.
alter table host_commission_rates
  add column period daterange
    generated always as (daterange(effective_from, effective_to, '[)')) stored;

alter table host_commission_rates
  add constraint no_overlapping_rates
  exclude using gist (host_id with =, period with &&);

create index host_commission_rates_host_idx on host_commission_rates (host_id);
