-- 0011 — Avaliações e mensagens
--
-- Ambas estão fora do MVP (blueprint §8.2) — as mensagens ficam no WhatsApp e
-- as avaliações vêm depois. O schema fica definido agora para que a decisão de
-- desenho não seja tomada à pressa mais tarde.

create table reviews (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null references bookings(id) on delete cascade,
  reviewer_id   uuid not null references users(id),
  listing_id    uuid references listings(id),
  experience_id uuid references experiences(id),
  rating        int not null check (rating between 1 and 5),
  comment       text,

  -- Revelação cega dupla: nenhuma avaliação aparece até ambas as partes terem
  -- submetido, ou até passarem 14 dias. Sem isto, as avaliações são
  -- sistematicamente inflacionadas pelo medo de retaliação.
  visible_at    timestamptz,

  created_at    timestamptz not null default now(),

  -- Uma avaliação por pessoa por reserva.
  unique (booking_id, reviewer_id)
);

create index reviews_listing_visible_idx
  on reviews (listing_id, created_at desc)
  where visible_at is not null;

create table messages (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references bookings(id) on delete cascade,
  sender_id    uuid not null references users(id),
  recipient_id uuid not null references users(id),
  content      text not null,
  read_at      timestamptz,
  created_at   timestamptz not null default now(),

  constraint no_self_message check (sender_id <> recipient_id)
);

create index messages_thread_idx on messages (booking_id, created_at desc);
