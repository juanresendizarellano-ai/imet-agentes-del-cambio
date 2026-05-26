-- Tabla de preregistros (gate de acceso a la landing)
--
-- El usuario, antes de poder navegar la landing, debe dejar al menos
-- nombre + WhatsApp. Esto es ANTES de que llene el mini-form del Hero
-- (que ya pide ademas edad y programa). El preregistro es el primer
-- "handshake" del visitante.
--
-- Funnel:
--   page_visits (anon)
--     -> preregistrations (nombre + whatsapp)
--       -> leads (mini-form, +edad +programa)
--         -> applications (form completo, +motivacion +direccion ...)
--
-- Por ahora NO empuja a CRM (decision de campana). Vive solo en Supabase
-- para que el equipo de Pepe Canto pueda exportar la lista cuando quiera.
create table if not exists preregistrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  full_name text not null,
  phone text not null,

  -- Si el visitante mas adelante completa el mini-form del Hero, enlazamos
  -- el lead para poder ver la conversion preregistro -> lead. Match por
  -- phone (normalizado en el backend antes del match).
  lead_id uuid references leads(id) on delete set null,

  source text default 'landing-pepe-canto-gate',
  ip_address text,
  user_agent text
);

create index if not exists preregistrations_created_at_idx on preregistrations(created_at desc);
create index if not exists preregistrations_phone_idx on preregistrations(phone);

drop trigger if exists preregistrations_updated_at on preregistrations;
create trigger preregistrations_updated_at
  before update on preregistrations
  for each row execute function set_updated_at();

alter table preregistrations enable row level security;

drop policy if exists "Anyone can preregister" on preregistrations;
create policy "Anyone can preregister"
  on preregistrations for insert
  to anon, authenticated
  with check (true);
