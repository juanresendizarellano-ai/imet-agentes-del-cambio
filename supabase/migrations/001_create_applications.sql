-- Tabla de aplicaciones del programa Agentes del Cambio
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Sección 1: datos personales
  full_name text not null,
  phone text not null,
  age integer not null check (age >= 15 and age <= 99),
  address text not null,
  reason text not null,

  -- Programa de interés
  program_type text not null check (program_type in ('licenciatura', 'maestria')),

  -- Sección 2: licenciatura (nullable, según program_type)
  licenciatura_escolarizada_ejecutiva text check (
    licenciatura_escolarizada_ejecutiva is null or
    licenciatura_escolarizada_ejecutiva in (
      'Contabilidad Financiera',
      'Administración de Empresas',
      'Derecho',
      'N/A'
    )
  ),
  licenciatura_virtual text check (
    licenciatura_virtual is null or
    licenciatura_virtual in (
      'Derecho',
      'Administración de Empresas',
      'Educación',
      'Inteligencia Artificial y Ciencia de Datos',
      'Ingeniería de Software',
      'N/A'
    )
  ),

  -- Sección 3: maestría (nullable, según program_type)
  maestria_ejecutiva text check (
    maestria_ejecutiva is null or
    maestria_ejecutiva in (
      'Alta Dirección',
      'Comunicación Organizacional',
      'Derecho Empresarial',
      'N/A'
    )
  ),
  maestria_virtual text check (
    maestria_virtual is null or
    maestria_virtual in (
      'Gestión Educativa',
      'Economía',
      'Finanzas',
      'Interiorismo y Diseño Urbano',
      'N/A'
    )
  ),

  -- Estado de revisión por el comité
  status text not null default 'pending' check (
    status in ('pending', 'reviewing', 'accepted', 'rejected')
  ),
  reviewer_notes text,

  -- Metadata
  source text default 'landing-pepe-canto',
  ip_address text,
  user_agent text
);

create index if not exists applications_created_at_idx on applications(created_at desc);
create index if not exists applications_status_idx on applications(status);
create index if not exists applications_program_type_idx on applications(program_type);

-- Trigger para updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists applications_updated_at on applications;
create trigger applications_updated_at
  before update on applications
  for each row execute function set_updated_at();

-- Row Level Security
alter table applications enable row level security;

-- Permitir INSERT público (cualquiera puede aplicar)
drop policy if exists "Anyone can apply" on applications;
create policy "Anyone can apply"
  on applications for insert
  to anon, authenticated
  with check (true);

-- Solo service_role puede leer (admin)
-- (No policy de SELECT para anon → bloqueado por default con RLS habilitado)
