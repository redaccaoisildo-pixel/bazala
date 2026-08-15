-- 0001 — Extensões
--
-- btree_gist é obrigatório: sem ele não há constraint de exclusão, e sem essa
-- constraint duas pessoas podem reservar as mesmas noites (blueprint §7.3).

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists btree_gist; -- exclusão sobre (uuid =, daterange &&)
