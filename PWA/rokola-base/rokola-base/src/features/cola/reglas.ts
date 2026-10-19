import type { Ajustes, EstadoSolicitud, Solicitud } from '@/lib/datos'

/** La persona todavía no canta esta canción. */
export const PENDIENTES: readonly EstadoSolicitud[] = ['en_revision', 'aprobada', 'llamada']
/** Ya pasó por la aprobación del DJ (cuenta para calcular la ronda). */
const APROBADAS: readonly EstadoSolicitud[] = ['aprobada', 'llamada', 'cantando', 'valorando', 'terminada']

/**
 * Fila justa: la ronda de una canción es 1 + cuántas canciones de esa persona ya aprobó el DJ esta noche.
 * La fila se ordena por ronda y luego por orden de aprobación, así nadie canta dos veces
 * mientras otro espera su primera.
 */
export function rondaPara(solicitudesNoche: readonly Solicitud[], cantanteId: string, excluirId?: string): number {
  return (
    1 +
    solicitudesNoche.filter((s) => s.cantante_id === cantanteId && s.id !== excluirId && APROBADAS.includes(s.estado))
      .length
  )
}

/**
 * Ronda que tendrá una solicitud en revisión si el DJ aprueba en orden de llegada:
 * también cuenta las anteriores de esa persona que siguen esperando revisión.
 */
export function rondaPrevista(solicitudesNoche: readonly Solicitud[], solicitud: Solicitud): number {
  const anterioresEnRevision = solicitudesNoche.filter(
    (s) => s.cantante_id === solicitud.cantante_id && s.estado === 'en_revision' && s.creada_en < solicitud.creada_en,
  ).length
  return rondaPara(solicitudesNoche, solicitud.cantante_id, solicitud.id) + anterioresEnRevision
}

/** Orden para la siguiente aprobación: siempre mayor que todos los de la noche (y que la hora actual). */
export function siguienteOrden(solicitudesNoche: readonly Solicitud[], ahora = Date.now()): number {
  return Math.max(ahora, ...solicitudesNoche.map((s) => (s.orden ?? 0) + 1))
}

const porTurno = (a: Solicitud, b: Solicitud) => (a.ronda ?? 0) - (b.ronda ?? 0) || (a.orden ?? 0) - (b.orden ?? 0)
const porLlegada = (a: Solicitud, b: Solicitud) => a.creada_en.localeCompare(b.creada_en)

export type EstadoFila = {
  /** En el escenario. */
  cantando: Solicitud | null
  /** Ya terminó y el público la está calificando. */
  valorando: Solicitud | null
  /** Llamada a pasar al escenario. */
  llamada: Solicitud | null
  /** Aprobadas, en el orden en que van a cantar. */
  enEspera: Solicitud[]
  /** Esperando que el DJ las apruebe, por orden de llegada. */
  enRevision: Solicitud[]
}

export function armarFila(solicitudesNoche: readonly Solicitud[]): EstadoFila {
  const de = (estado: EstadoSolicitud) => solicitudesNoche.filter((s) => s.estado === estado)
  const primera = (estado: EstadoSolicitud, orden: (a: Solicitud, b: Solicitud) => number) =>
    de(estado).sort(orden)[0] ?? null
  return {
    cantando: primera('cantando', (a, b) => (a.inicio_en ?? '').localeCompare(b.inicio_en ?? '')),
    valorando: primera('valorando', (a, b) => (b.fin_en ?? '').localeCompare(a.fin_en ?? '')),
    llamada: primera('llamada', porTurno),
    enEspera: de('aprobada').sort(porTurno),
    enRevision: de('en_revision').sort(porLlegada),
  }
}

/** Turnos que faltan antes de que cante esta solicitud (0 = es la siguiente). null si no está en la fila. */
export function turnosAntes(fila: EstadoFila, id: string): number | null {
  if (fila.llamada?.id === id) return 0
  const i = fila.enEspera.findIndex((s) => s.id === id)
  if (i < 0) return null
  return i + (fila.llamada ? 1 : 0)
}

/** Minutos aproximados de espera (la canción que suena ahora cuenta como media). */
export function esperaEstimada(turnos: number, hayAlguienCantando: boolean, minutosPorTurno: number): number {
  return Math.round((turnos + (hayAlguienCantando ? 0.5 : 0)) * minutosPorTurno)
}

/** Para subir o bajar un turno se intercambian (ronda, orden) con el vecino. null si ya está en la orilla. */
export function intercambio(enEspera: readonly Solicitud[], id: string, direccion: 'subir' | 'bajar') {
  const i = enEspera.findIndex((s) => s.id === id)
  const j = direccion === 'subir' ? i - 1 : i + 1
  if (i < 0 || j < 0 || j >= enEspera.length) return null
  const [a, b] = [enEspera[i], enEspera[j]]
  return [
    { id: a.id, ronda: b.ronda, orden: b.orden },
    { id: b.id, ronda: a.ronda, orden: a.orden },
  ] as const
}

export type Permiso = { ok: true } | { ok: false; motivo: string }

/** ¿Esta persona puede pedir otra canción ahora? */
export function puedePedir(solicitudesNoche: readonly Solicitud[], cantanteId: string, ajustes: Ajustes): Permiso {
  if (!ajustes.aceptando) return { ok: false, motivo: 'El DJ cerró la fila por ahora. Vuelve a intentarlo en un rato.' }
  const pendientes = solicitudesNoche.filter((s) => s.cantante_id === cantanteId && PENDIENTES.includes(s.estado))
  if (pendientes.length < ajustes.max_pendientes) return { ok: true }
  return {
    ok: false,
    motivo:
      ajustes.max_pendientes === 1
        ? 'Ya tienes una canción en la fila. Cuando la cantes podrás pedir otra.'
        : `Ya tienes ${pendientes.length} canciones en la fila. Cuando cantes una podrás pedir otra.`,
  }
}

/** Otras solicitudes de esta noche con la misma canción (para avisarle al DJ). */
export function mismaCancionHoy(solicitudesNoche: readonly Solicitud[], solicitud: Solicitud): Solicitud[] {
  const clave = (s: Solicitud) => s.cancion_id ?? `${s.titulo}|${s.artista}`.toLowerCase()
  return solicitudesNoche.filter(
    (s) =>
      s.id !== solicitud.id && clave(s) === clave(solicitud) && s.estado !== 'rechazada' && s.estado !== 'cancelada',
  )
}

/** Solo letras A–Z, en mayúsculas, máximo 3 ("Ñoño" → "NON"). */
export function limpiarIniciales(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
}

export type DatosPedido = {
  mesa: number
  cantante_id: string
  nombre: string
  iniciales: string
  cancion_id: string | null
  titulo: string
  artista: string
  dueto_con: string | null
  nota: string | null
  compite: boolean
}

/** Revisa un pedido antes de enviarlo. Devuelve el error para mostrar, o null si está bien. */
export function validarPedido(d: DatosPedido, totalMesas: number): string | null {
  if (!d.nombre.trim()) return 'Escribe tu nombre.'
  if (d.nombre.trim().length > 30) return 'El nombre es muy largo (máximo 30 letras).'
  if (limpiarIniciales(d.iniciales).length !== 3) return 'Las iniciales deben ser 3 letras.'
  if (!d.titulo.trim()) return 'Escribe el nombre de la canción.'
  if (!Number.isInteger(d.mesa) || d.mesa < 1 || d.mesa > totalMesas)
    return `Escribe tu número de mesa (del 1 al ${totalMesas}).`
  return null
}
