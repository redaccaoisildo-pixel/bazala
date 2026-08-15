-- 0012 — Row Level Security
--
-- No Supabase o RLS está DESLIGADO por omissão, e o modo de falha é exposição
-- total silenciosa: a base de dados não se queixa, apenas devolve tudo a
-- qualquer pessoa com a chave anónima. Por isso isto entra antes do primeiro
-- utilizador real, não depois (blueprint §7.3).
--
-- Verificar sempre com uma segunda conta real, tentando aceder aos dados da
-- primeira. Ler as políticas não é verificá-las.

-- Função auxiliar. SECURITY DEFINER porque tem de ler `users` sem passar pelo
-- RLS de `users` — caso contrário a política recorre a si própria.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from users where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function owns_listing(target uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from listings where id = target and host_id = auth.uid()
  );
$$;

alter table users                  enable row level security;
alter table listings               enable row level security;
alter table listing_photos         enable row level security;
alter table availability           enable row level security;
alter table experiences            enable row level security;
alter table bookings               enable row level security;
alter table payouts                enable row level security;
alter table ledger_entries         enable row level security;
alter table booking_events         enable row level security;
alter table reviews                enable row level security;
alter table messages               enable row level security;
alter table host_commission_rates  enable row level security;

-- ── users ────────────────────────────────────────────────────────────────────
create policy users_select_self on users
  for select using (id = auth.uid() or is_admin());

create policy users_update_self on users
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy users_insert_self on users
  for insert with check (id = auth.uid());

-- ── listings ─────────────────────────────────────────────────────────────────
-- Aprovados são públicos; o resto só o dono e o admin.
create policy listings_select_public on listings
  for select using (status = 'approved' or host_id = auth.uid() or is_admin());

create policy listings_insert_own on listings
  for insert with check (host_id = auth.uid());

create policy listings_update_own on listings
  for update using (host_id = auth.uid() or is_admin());

create policy listings_delete_own on listings
  for delete using (host_id = auth.uid() or is_admin());

-- ── listing_photos ───────────────────────────────────────────────────────────
create policy listing_photos_select on listing_photos
  for select using (
    exists (select 1 from listings l where l.id = listing_id and l.status = 'approved')
    or owns_listing(listing_id)
    or is_admin()
  );

create policy listing_photos_write on listing_photos
  for all using (owns_listing(listing_id) or is_admin())
  with check (owns_listing(listing_id) or is_admin());

-- ── availability ─────────────────────────────────────────────────────────────
create policy availability_select on availability
  for select using (
    exists (select 1 from listings l where l.id = listing_id and l.status = 'approved')
    or owns_listing(listing_id)
    or is_admin()
  );

create policy availability_write on availability
  for all using (owns_listing(listing_id) or is_admin())
  with check (owns_listing(listing_id) or is_admin());

-- ── experiences ──────────────────────────────────────────────────────────────
create policy experiences_select on experiences
  for select using (status = 'approved' or host_id = auth.uid() or is_admin());

create policy experiences_write on experiences
  for all using (host_id = auth.uid() or is_admin())
  with check (host_id = auth.uid() or is_admin());

-- ── bookings ─────────────────────────────────────────────────────────────────
-- O hóspede vê as suas; o anfitrião vê as dos seus alojamentos.
create policy bookings_select on bookings
  for select using (
    guest_id = auth.uid()
    or (listing_id is not null and owns_listing(listing_id))
    or is_admin()
  );

create policy bookings_insert_own on bookings
  for insert with check (guest_id = auth.uid());

-- Alterações de estado passam por funções do servidor, não por UPDATE directo
-- do cliente. Só o admin escreve daqui.
create policy bookings_update_admin on bookings
  for update using (is_admin());

-- ── payouts ──────────────────────────────────────────────────────────────────
create policy payouts_select on payouts
  for select using (host_id = auth.uid() or is_admin());

create policy payouts_write_admin on payouts
  for all using (is_admin()) with check (is_admin());

-- ── ledger_entries ───────────────────────────────────────────────────────────
-- Dados financeiros da plataforma. Ninguém além do admin, e as escritas são
-- feitas por processos do servidor com a service role.
create policy ledger_admin_only on ledger_entries
  for all using (is_admin()) with check (is_admin());

-- ── booking_events ───────────────────────────────────────────────────────────
create policy booking_events_select on booking_events
  for select using (
    exists (
      select 1 from bookings b
      where b.id = booking_id
        and (b.guest_id = auth.uid()
             or (b.listing_id is not null and owns_listing(b.listing_id)))
    )
    or is_admin()
  );

-- ── reviews ──────────────────────────────────────────────────────────────────
create policy reviews_select_visible on reviews
  for select using (visible_at is not null or reviewer_id = auth.uid() or is_admin());

create policy reviews_insert_own on reviews
  for insert with check (
    reviewer_id = auth.uid()
    and exists (
      select 1 from bookings b
      where b.id = booking_id
        and b.status = 'completed'
        and (b.guest_id = auth.uid()
             or (b.listing_id is not null and owns_listing(b.listing_id)))
    )
  );

-- ── messages ─────────────────────────────────────────────────────────────────
create policy messages_select on messages
  for select using (
    sender_id = auth.uid() or recipient_id = auth.uid() or is_admin()
  );

create policy messages_insert on messages
  for insert with check (sender_id = auth.uid());

-- ── host_commission_rates ────────────────────────────────────────────────────
-- O anfitrião pode ver a sua taxa; só o admin a define.
create policy commission_rates_select on host_commission_rates
  for select using (host_id = auth.uid() or is_admin());

create policy commission_rates_write_admin on host_commission_rates
  for all using (is_admin()) with check (is_admin());
