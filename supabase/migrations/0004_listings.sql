-- 0004 — Alojamentos
--
-- Preços em METICAIS, nunca em dólares (blueprint §6.4). O metical é a fonte
-- de verdade; USD e ZAR são conversões indicativas, calculadas na exibição.
--
-- `host_net_per_night` é o que o anfitrião quer receber. `price_per_night` é o
-- preço listado, derivado dele pela comissão em vigor (§4.3). Guardam-se os
-- dois: o primeiro é a intenção do anfitrião, o segundo é o que o hóspede vê.

create table listings (
  id                  uuid primary key default gen_random_uuid(),
  host_id             uuid not null references users(id) on delete cascade,
  title               varchar(255) not null,
  description         text not null,
  type                listing_type not null,

  city                varchar(100) not null,
  province            varchar(100) not null,
  neighbourhood       varchar(100),
  address             text,
  lat                 numeric(9,6),
  lng                 numeric(9,6),

  max_guests          int not null check (max_guests > 0),
  bedrooms            int not null default 0 check (bedrooms >= 0),
  bathrooms           int not null default 0 check (bathrooms >= 0),
  amenities           text[] not null default '{}',

  currency            char(3) not null default 'MZN',
  host_net_per_night  numeric(12,2) not null check (host_net_per_night > 0),
  price_per_night     numeric(12,2) not null check (price_per_night > 0),
  min_nights          int not null default 1 check (min_nights > 0),

  cancellation_policy cancellation_policy not null default 'moderate',
  status              listing_status not null default 'pending',

  -- Declaração de licenciamento do anfitrião (blueprint §6.3). Não policiamos
  -- no ano 1, mas registamos quem declarou o quê e quando.
  licence_declared    boolean not null default false,
  licence_declared_at timestamptz,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint price_covers_host_net check (price_per_night >= host_net_per_night)
);

create table listing_photos (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  url        text not null,
  position   int not null default 0,
  width      int,
  height     int,
  blurhash   text,  -- marcador leve enquanto a foto carrega em 3G (§7.4)
  created_at timestamptz not null default now(),

  unique (listing_id, position)
);
