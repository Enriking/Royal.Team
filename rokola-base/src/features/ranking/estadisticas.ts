import { HORA_CORTE, type Cancion, type Solicitud } from '@/lib/datos'

export type Conteo = { titulo: string; artista: string; veces: number }

export type Estadisticas = {
  /** Solicitudes recibidas (sin contar las que el cliente canceló). */
  pedidos: number
  cantadas: number
  rechazadas: number
  cantantes: number
  mesas: number
  /** Minutos promedio desde que el DJ aprueba hasta que la persona canta. */
  esperaPromedio: number | null
  puntajePromedio: number | null
  /** Pedidos por hora del día, en el orden de la noche (de las 6 p.m. a la madrugada). */
  porHora: { hora: number; pedidos: number }[]
  masPedidas: Conteo[]
  /** Pedidas como texto libre: canciones que el catálogo no tiene. */
  faltantes: Conteo[]
  porGenero: { genero: string; veces: number }[]
}

const clave = (s: Pick<Solicitud, 'titulo' | 'artista'>) =>
  `${s.titulo}|${s.artista}`.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()

function contar(solicitudes: readonly Solicitud[], limite: number): Conteo[] {
  const conteo = new Map<string, Conteo>()
  for (const s of solicitudes) {
    const k = clave(s)
    const actual = conteo.get(k)
    if (actual) actual.veces++
    else conteo.set(k, { titulo: s.titulo, artista: s.artista, veces: 1 })
  }
  return [...conteo.values()]
    .sort((a, b) => b.veces - a.veces || a.titulo.localeCompare(b.titulo, 'es'))
    .slice(0, limite)
}

const promedio = (valores: number[]) =>
  valores.length ? Math.round(valores.reduce((a, b) => a + b, 0) / valores.length) : null

/** Estadísticas de un conjunto de solicitudes (una noche, una semana o un mes). */
export function estadisticas(solicitudes: readonly Solicitud[], canciones: readonly Cancion[]): Estadisticas {
  const validas = solicitudes.filter(
    (s) => !(s.estado === 'cancelada' && s.motivo_rechazo === 'Cancelada por el cliente'),
  )
  const aceptadas = validas.filter((s) => s.estado !== 'rechazada')

  const esperas = validas
    .filter((s) => s.aprobada_en && s.inicio_en)
    .map((s) => (new Date(s.inicio_en!).getTime() - new Date(s.aprobada_en!).getTime()) / 60_000)

  // Pedidos por hora local; la noche empieza a las 6 p.m. y termina a la hora de corte
  const horas = new Map<number, number>()
  for (const s of validas) {
    const hora = new Date(s.creada_en).getHours()
    horas.set(hora, (horas.get(hora) ?? 0) + 1)
  }
  const ordenNoche = Array.from({ length: 24 }, (_, i) => (18 + i) % 24).filter(
    (h) => h >= 18 || h < HORA_CORTE || horas.has(h),
  )
  const conPedidos = ordenNoche.map((hora) => ({ hora, pedidos: horas.get(hora) ?? 0 }))
  const primera = conPedidos.findIndex((h) => h.pedidos > 0)
  const ultima = conPedidos.findLastIndex((h) => h.pedidos > 0)
  const porHora = primera < 0 ? [] : conPedidos.slice(primera, ultima + 1)

  const generoDe = new Map(canciones.map((c) => [c.id, c.genero]))
  const generos = new Map<string, number>()
  for (const s of aceptadas) {
    const genero = (s.cancion_id && generoDe.get(s.cancion_id)) || null
    if (genero) generos.set(genero, (generos.get(genero) ?? 0) + 1)
  }

  return {
    pedidos: validas.length,
    cantadas: validas.filter((s) => s.estado === 'terminada').length,
    rechazadas: validas.filter((s) => s.estado === 'rechazada').length,
    cantantes: new Set(validas.map((s) => s.cantante_id)).size,
    mesas: new Set(validas.map((s) => s.mesa)).size,
    esperaPromedio: promedio(esperas),
    puntajePromedio: promedio(validas.filter((s) => s.puntaje !== null).map((s) => s.puntaje!)),
    porHora,
    masPedidas: contar(aceptadas, 5),
    faltantes: contar(
      validas.filter((s) => !s.cancion_id),
      10,
    ),
    porGenero: [...generos]
      .map(([genero, veces]) => ({ genero, veces }))
      .sort((a, b) => b.veces - a.veces)
      .slice(0, 8),
  }
}
