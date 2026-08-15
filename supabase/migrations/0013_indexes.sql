-- 0013 — Índices de pesquisa
--
-- Nota sobre a configuração 'portuguese': a blueprint original especificava
-- full-text search do Supabase sem indicar configuração de texto, o que teria
-- aplicado stemming inglês a conteúdo português. 'casas' e 'casa' deixariam de
-- ser a mesma palavra.

create index listings_city_status_idx
  on listings (city, status)
  where status = 'approved';

create index listings_host_idx on listings (host_id);

create index listings_amenities_idx on listings using gin (amenities);

create index listings_search_idx
  on listings
  using gin (
    to_tsvector(
      'portuguese',
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' ||
      coalesce(city, '') || ' ' || coalesce(neighbourhood, '')
    )
  );

-- Actualiza updated_at em qualquer escrita.
create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_touch       before update on users       for each row execute function touch_updated_at();
create trigger listings_touch    before update on listings    for each row execute function touch_updated_at();
create trigger experiences_touch before update on experiences for each row execute function touch_updated_at();
create trigger bookings_touch    before update on bookings    for each row execute function touch_updated_at();
