-- Tabla de leads (captura rapida del mini-form en hero)
--
-- Separada de `applications`:
--   - `leads` = captura rapida (nombre + telefono + edad + tipo) desde el hero.
--     Marcadas como stage='prospect'. Pueden NO completar la aplicacion oficial.
--   - `applications` = formulario completo del final con motivacion, programa
--     especifico, direccion, etc.
--
-- Se escribe en ambos lados: aqui (control de campana) Y en el CRM iMET
-- (round-robin a asesores). Si el CRM responde 200, guardamos el lead_id en
-- crm_lead_id para que un seguimiento posterior pueda fusionar la aplicacion
-- completa con el lead inicial.
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  full_name text not null,
  phone text not null,
  age integer not null check (age >= 15 and age <= 99),
  program_type text not null check (program_type in ('licenciatura', 'maestria')),

  -- Etapa del funnel:
  --   prospect  = capturado por mini-form (hero), no ha enviado aplicacion completa
  --   applicant = el mismo (o nuevo) lead que ya envio la aplicacion completa
  stage text not null default 'prospect' check (stage in ('prospect', 'applicant')),

  -- Si se logro pushear al CRM, guardamos el id devuelto. Si fallo el push,
  -- queda NULL y el lead vive solo en Supabase para reintento manual.
  crm_lead_id text,
  crm_push_status text check (crm_push_status in ('success', 'failed') or crm_push_status is null),
  crm_push_error text,

  -- Si el lead luego completa la aplicacion oficial, linkeamos
  application_id uuid references applications(id) on delete set null,

  source text default 'landing-pepe-canto-mini-form',
  ip_address text,
  user_agent text
);

create index if not exists leads_created_at_idx on leads(created_at desc);
create index if not exists leads_phone_idx on leads(phone);
create index if not exists leads_stage_idx on leads(stage);

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

alter table leads enable row level security;

drop policy if exists "Anyone can register as lead" on leads;
create policy "Anyone can register as lead"
  on leads for insert
  to anon, authenticated
  with check (true);
