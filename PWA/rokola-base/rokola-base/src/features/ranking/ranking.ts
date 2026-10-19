import { mesDe, type Solicitud } from '@/lib/datos'

const porPuntaje = (a: Solicitud, b: Solicitud) =>
  b.puntaje! - a.puntaje! || (a.cerrada_en ?? '').localeCompare(b.cerrada_en ?? '')

/**
 * Récords: la mejor actuación de cada persona (una sola por persona, para que nadie llene la tabla),
 * solo de quienes eligieron competir y tienen puntaje. En empate gana quien lo logró primero.
 */
export function mejoresActuaciones(solicitudes: readonly Solicitud[], limite = 10): Solicitud[] {
  const mejores = new Map<string, Solicitud>()
  for (const s of solicitudes) {
    if (!s.compite || s.estado !== 'terminada' || s.puntaje === null) continue
    const actual = mejores.get(s.cantante_id)
    if (!actual || porPuntaje(s, actual) < 0) mejores.set(s.cantante_id, s)
  }
  return [...mejores.values()].sort(porPuntaje).slice(0, limite)
}

export function topNoche(solicitudes: readonly Solicitud[], noche: string, limite = 10) {
  return mejoresActuaciones(
    solicitudes.filter((s) => s.noche === noche),
    limite,
  )
}

/** Salón de la fama de un mes ('AAAA-MM'). */
export function salonDeLaFama(solicitudes: readonly Solicitud[], mes: string, limite = 10) {
  return mejoresActuaciones(
    solicitudes.filter((s) => mesDe(s.noche) === mes),
    limite,
  )
}

/** Nombre del mes en español: '2026-10' → 'octubre 2026'. */
export function nombreMes(mes: string) {
  const [anio, numero] = mes.split('-').map(Number)
  return new Date(anio, numero - 1, 1).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
}
