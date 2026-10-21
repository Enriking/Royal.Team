import type { Cancion, Solicitud } from '@/lib/datos'

export type Lista = { id: string; titulo: string; canciones: Cancion[] }

const RE_REGIONAL = /norte|banda|grupero|sierre|corrido|duranguense/i

const porTitulo = (a: Cancion, b: Cancion) => a.titulo.localeCompare(b.titulo, 'es')

/** Canciones del catálogo más pedidas (todas las noches guardadas; no cuentan las rechazadas ni canceladas). */
export function masPedidas(canciones: readonly Cancion[], solicitudes: readonly Solicitud[], limite = 20): Cancion[] {
  const conteo = new Map<string, number>()
  for (const s of solicitudes) {
    if (!s.cancion_id || s.estado === 'rechazada' || s.estado === 'cancelada') continue
    conteo.set(s.cancion_id, (conteo.get(s.cancion_id) ?? 0) + 1)
  }
  return canciones
    .filter((c) => conteo.has(c.id))
    .sort((a, b) => conteo.get(b.id)! - conteo.get(a.id)! || porTitulo(a, b))
    .slice(0, limite)
}

/** Listas que se muestran al cliente. Las vacías no aparecen. */
export function listasCuradas(canciones: readonly Cancion[], solicitudes: readonly Solicitud[]): Lista[] {
  const listas: Lista[] = [
    { id: 'mas-pedidas', titulo: 'Lo más pedido', canciones: masPedidas(canciones, solicitudes) },
    { id: 'favoritas', titulo: 'Favoritas del DJ', canciones: canciones.filter((c) => c.favorita).sort(porTitulo) },
    {
      id: 'regional',
      titulo: 'Norteño y banda',
      canciones: canciones.filter((c) => c.genero && RE_REGIONAL.test(c.genero)).sort(porTitulo),
    },
    { id: 'duetos', titulo: 'Duetos', canciones: canciones.filter((c) => c.dueto).sort(porTitulo) },
  ]
  return listas.filter((l) => l.canciones.length > 0)
}

/** Géneros que hay en el catálogo, con cuántas canciones tiene cada uno. */
export function generos(canciones: readonly Cancion[]): { genero: string; total: number }[] {
  const conteo = new Map<string, number>()
  for (const c of canciones) if (c.genero) conteo.set(c.genero, (conteo.get(c.genero) ?? 0) + 1)
  return [...conteo]
    .map(([genero, total]) => ({ genero, total }))
    .sort((a, b) => b.total - a.total || a.genero.localeCompare(b.genero, 'es'))
}
