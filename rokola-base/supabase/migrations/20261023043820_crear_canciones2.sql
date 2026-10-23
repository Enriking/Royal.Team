create table public.canciones (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  artista text not null,
  genero text,
  favorita boolean not null default false,
  dueto boolean not null default false,
  archivo text,
  creada_en timestamptz not null default now()
);

-- Seguridad a nivel de fila: sin una política, nadie puede leer ni escribir
alter table public.canciones enable row level security;

-- Cualquier cliente de la PWA puede leer el catálogo
create policy "Leer catálogo" on public.canciones
  for select to anon, authenticated using (true);

-- Avisar en tiempo real cuando cambie el catálogo
alter publication supabase_realtime add table public.canciones;
