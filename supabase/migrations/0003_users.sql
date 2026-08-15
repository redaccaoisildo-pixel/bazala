-- 0003 — Utilizadores
--
-- O telefone é a identidade primária (blueprint §7.1). Isso só funciona se for
-- guardado normalizado em E.164: '84 123 4567' e '+258841234567' têm de ser o
-- mesmo utilizador, ou a identidade por telefone não vale nada.

create table users (
  id              uuid primary key references auth.users(id) on delete cascade,
  phone           varchar(20) not null unique,
  email           varchar(255) unique,
  full_name       varchar(255) not null,
  role            user_role not null default 'guest',
  avatar_url      text,
  whatsapp_number varchar(20),
  verified        boolean not null default false,
  verified_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint phone_is_e164
    check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  constraint whatsapp_is_e164
    check (whatsapp_number is null or whatsapp_number ~ '^\+[1-9][0-9]{7,14}$')
);

comment on column users.phone is
  'E.164 com prefixo +, ex. +258841234567. Normalizar antes de inserir.';

create index users_role_idx on users (role);
