-- Tabla de visitas a la landing
create table if not exists page_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null default '/',
  ip_address text,
  user_agent text,
  referrer text,
  -- Identificador de sesión del visitante (random UUID generado en cliente y
  -- guardado en localStorage). Sirve para dedup: un mismo visitor cuenta como
  -- 1 visita única aunque recargue la página.
  visitor_id text
);

create index if not exists page_visits_created_at_idx on page_visits(created_at desc);
create index if not exists page_visits_ip_idx on page_visits(ip_address);
create index if not exists page_visits_visitor_id_idx on page_visits(visitor_id);
create index if not exists page_visits_path_idx on page_visits(path);

-- Row Level Security
alter table page_visits enable row level security;

-- INSERT público (los visitantes logean su propia visita anónima)
drop policy if exists "Anyone can log visit" on page_visits;
create policy "Anyone can log visit"
  on page_visits for insert
  to anon, authenticated
  with check (true);

-- (No policy de SELECT → solo se lee con service_role desde /admin)
