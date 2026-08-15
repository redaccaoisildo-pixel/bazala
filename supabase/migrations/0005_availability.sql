-- 0005 — Disponibilidade
--
-- Esta tabela faltava por completo na blueprint original, e a sua ausência
-- tornava o fluxo de reserva impossível de implementar: o anfitrião não podia
-- bloquear datas e a pesquisa não conseguia responder "está livre?".
--
-- Uma linha por alojamento por dia. É verboso, mas torna triviais as duas
-- consultas que interessam — disponibilidade num intervalo, e preço por noite
-- com sobreposição sazonal.

create table availability (
  id             uuid primary key default gen_random_uuid(),
  listing_id     uuid not null references listings(id) on delete cascade,
  date           date not null,
  is_available   boolean not null default true,
  price_override numeric(12,2) check (price_override is null or price_override > 0),
  min_nights     int check (min_nights is null or min_nights > 0),

  unique (listing_id, date)
);

comment on column availability.price_override is
  'MZN. Nulo significa usar listings.price_per_night.';

create index availability_open_idx
  on availability (listing_id, date)
  where is_available;
