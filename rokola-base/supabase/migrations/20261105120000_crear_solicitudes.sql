-- Solicitudes de canciones (rama pruebas-experimentales).
-- Mismos campos que el tipo `Solicitud` de src/lib/datos/tipos.ts.
create table public.solicitudes (
  id uuid primary key,
  noche date not null,
  creada_en timestamptz not null default now(),
  mesa smallint not null check (mesa between 1 and 200),
  dispositivo_id text not null check (char_length(dispositivo_id) <= 64),
  cantante_id text not null check (char_length(cantante_id) <= 64),
  nombre text not null check (char_length(nombre) between 1 and 40),
  iniciales text not null check (iniciales ~ '^[A-Z]{3}$'),
  cancion_id uuid references public.canciones (id) on delete set null,
  titulo text not null check (char_length(titulo) between 1 and 120),
  artista text not null default '' check (char_length(artista) <= 120),
  dueto_con text check (char_length(dueto_con) <= 40),
  nota text check (char_length(nota) <= 200),
  compite boolean not null default true,
  estado text not null default 'en_revision' check (
    estado in ('en_revision', 'aprobada', 'llamada', 'cantando', 'valorando', 'terminada', 'rechazada', 'cancelada')
  ),
  motivo_rechazo text,
  ronda smallint,
  orden double precision,
  aprobada_en timestamptz,
  llamada_en timestamptz,
  inicio_en timestamptz,
  fin_en timestamptz,
  cerrada_en timestamptz,
  aplausos smallint check (aplausos between 0 and 100),
  energia smallint check (energia between 0 and 100),
  calificacion numeric(3, 2) check (calificacion between 1 and 3),
  puntaje smallint check (puntaje between 0 and 100)
);

create index solicitudes_noche_estado on public.solicitudes (noche, estado);

-- Seguridad a nivel de fila: sin política, nadie lee ni escribe.
alter table public.solicitudes enable row level security;

-- Experimental: el cliente (clave pública) solo puede INSERTAR solicitudes nuevas,
-- y únicamente en estado "en revisión" y sin datos que le corresponden al DJ.
-- No hay política de lectura para anon: los nombres de los clientes no quedan públicos.
create policy "Cliente crea su solicitud" on public.solicitudes
  for insert to anon, authenticated
  with check (
    estado = 'en_revision'
    and ronda is null and orden is null and aprobada_en is null
    and puntaje is null and aplausos is null and energia is null and calificacion is null
  );

-- Para cuando la bandeja del DJ lea desde Supabase.
alter publication supabase_realtime add table public.solicitudes;
