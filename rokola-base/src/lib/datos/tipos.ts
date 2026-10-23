/**
 * Tablas de Rokola. Los nombres de campo son los mismos que tendrán las columnas en Supabase,
 * así el día que se conecte la base solo cambia el almacén, no las características.
 */

/** Canción del catálogo (disco duro del DJ). */
export type Cancion = {
  id: string
  titulo: string
  artista: string
  genero: string | null
  /** Aparece en la lista "Favoritas del DJ". */
  favorita: boolean
  /** Aparece en la lista "Duetos". */
  dueto: boolean
  /** Nombre del archivo en el disco del DJ, si se importó desde una carpeta. */
  archivo: string | null
  creada_en: string
}

/**
 * Vida de una solicitud:
 * en_revision → aprobada → llamada → cantando → valorando → terminada
 * (o rechazada por el DJ, o cancelada por el cliente / porque no se presentó).
 */
export type EstadoSolicitud =
  'en_revision' | 'aprobada' | 'llamada' | 'cantando' | 'valorando' | 'terminada' | 'rechazada' | 'cancelada'

export type Solicitud = {
  id: string
  /** Noche del bar a la que pertenece (AAAA-MM-DD). Ver `nocheDe`. */
  noche: string
  creada_en: string
  /** Número de mesa que escribió el cliente al pedir (1 a `Ajustes.total_mesas`). */
  mesa: number
  dispositivo_id: string
  /** Persona que canta. Un celular puede tener varias (amigos que comparten teléfono). */
  cantante_id: string
  nombre: string
  /** 3 letras para el ranking arcade. */
  iniciales: string
  /** null = pedida como texto libre (no está en el catálogo). */
  cancion_id: string | null
  titulo: string
  artista: string
  dueto_con: string | null
  nota: string | null
  /** "Quiero competir": entra al ranking. */
  compite: boolean
  estado: EstadoSolicitud
  motivo_rechazo: string | null
  /** Ronda y orden se asignan al aprobar; la fila se ordena por (ronda, orden). */
  ronda: number | null
  orden: number | null
  aprobada_en: string | null
  llamada_en: string | null
  inicio_en: string | null
  /** Terminó de cantar: se abre la votación. */
  fin_en: string | null
  /** Se cerró la votación y quedó el puntaje. */
  cerrada_en: string | null
  /** 0–100, del aplausómetro. */
  aplausos: number | null
  /** 0–100, de las reacciones con emojis. */
  energia: number | null
  /** Promedio de 1 a 3. */
  calificacion: number | null
  /** 0–100. */
  puntaje: number | null
}

export type Reaccion = {
  id: string
  noche: string
  solicitud_id: string
  dispositivo_id: string
  emoji: string
  creada_en: string
}

export type Calificacion = {
  /** `${solicitud_id}:${dispositivo_id}`: un voto por celular. */
  id: string
  noche: string
  solicitud_id: string
  dispositivo_id: string
  /** 1 Bien · 2 Muy bien · 3 ¡Increíble! */
  valor: 1 | 2 | 3
  creada_en: string
}

/** Configuración del bar (una sola fila, id 'bar'). */
export type Ajustes = {
  id: 'bar'
  nombre_bar: string
  /** Si es false, los clientes no pueden pedir canciones. */
  aceptando: boolean
  /** Canciones en espera (sin cantar) que puede tener cada persona. */
  max_pendientes: number
  /** Para estimar la espera en "Mi turno". */
  minutos_por_turno: number
  /** Tiempo para calificar después de que alguien termina. */
  segundos_votacion: number
  /** Reacciones por celular en cada canción. */
  max_reacciones: number
  /** Reacciones totales con las que la energía llega a 100. */
  reacciones_energia_max: number
  /** Pesos del puntaje, en porcentaje. */
  peso_aplausos: number
  peso_calificacion: number
  peso_energia: number
  /** Mesas del bar: el cliente escribe un número del 1 a este. */
  total_mesas: number
  /** Dirección para los QR (ej. https://rokola.mx). Vacía = la dirección con la que se abrió la app. */
  url_publica: string
}

export type Tablas = {
  canciones: Cancion
  solicitudes: Solicitud
  reacciones: Reaccion
  calificaciones: Calificacion
  ajustes: Ajustes
}

export type NombreTabla = keyof Tablas
export type Fila<T extends NombreTabla> = Tablas[T]
