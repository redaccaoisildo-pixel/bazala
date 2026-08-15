-- 0008 — Experiências
--
-- Fora do MVP (blueprint §8.2): não se constroem dois marketplaces ao mesmo
-- tempo. A tabela existe para que `bookings` possa referenciá-la sem uma
-- migração destrutiva mais tarde, mas nada no produto a usa ainda.

create table experiences (
  id               uuid primary key default gen_random_uuid(),
  host_id          uuid not null references users(id) on delete cascade,
  title            varchar(255) not null,
  description      text not null,
  duration_hours   numeric(4,1) not null check (duration_hours > 0),
  meeting_location text not null,
  city             varchar(100) not null,
  currency         char(3) not null default 'MZN',
  price_per_person numeric(12,2) not null check (price_per_person > 0),
  max_participants int not null check (max_participants > 0),
  status           listing_status not null default 'pending',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
