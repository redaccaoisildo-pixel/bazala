-- 0002 — Tipos enumerados

create type user_role as enum ('guest', 'host', 'admin');

create type listing_type as enum (
  'apartamento', 'guesthouse', 'pensao', 'casa', 'lodge', 'hotel', 'hostel'
);

create type listing_status as enum ('pending', 'approved', 'rejected', 'inactive');

create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

create type payment_status as enum ('unpaid', 'paid', 'refunded', 'partially_refunded');

create type payout_status as enum ('pending', 'processing', 'completed', 'failed');

create type payout_method as enum ('mpesa', 'emola', 'mkesh', 'bank_transfer');

-- Política de cancelamento escolhida pelo anfitrião (blueprint §10.3).
create type cancellation_policy as enum ('flexible', 'moderate', 'strict');

-- Tratamento de IVA da comissão. `zero_rated` cobre a hipótese de exportação
-- de serviços a não residentes — a confirmar com contabilista (§6.2, pergunta 4).
create type iva_treatment as enum ('standard', 'zero_rated', 'exempt');

-- Tipos de lançamento do ledger (§7.2). O ledger é de partida dobrada: nunca
-- derivar números financeiros só da tabela de reservas.
create type ledger_entry_type as enum (
  'guest_payment',
  'platform_commission',
  'output_iva',
  'input_iva',
  'psp_fee',
  'host_payable',
  'host_payout',
  'refund',
  'adjustment'
);
