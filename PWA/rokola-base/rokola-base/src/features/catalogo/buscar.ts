import type { Cancion } from '@/lib/datos'

/** Minúsculas, sin acentos ni signos: "¡Bésame, Mucho!" → "besame mucho". La ñ cuenta como n. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const palabras = (texto: string) => normalizar(texto).split(' ').filter(Boolean)

/** Distancia de edición (con transposiciones). Se rinde y devuelve `max + 1` en cuanto la supera. */
export function distancia(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let anterior2: number[] = []
  let anterior = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const actual = [i]
    let minFila = i
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1
      let d = Math.min(anterior[j] + 1, actual[j - 1] + 1, anterior[j - 1] + costo)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, anterior2[j - 2] + 1)
      actual[j] = d
      minFila = Math.min(minFila, d)
    }
    if (minFila > max) return max + 1
    anterior2 = anterior
    anterior = actual
  }
  return anterior[b.length]
}

/** Errores de dedo que se perdonan según el largo de la palabra buscada. */
const tolerancia = (largo: number) => (largo >= 8 ? 2 : largo >= 4 ? 1 : 0)

/** Qué tan bien empata una palabra buscada con una del catálogo: 3 exacta, 2 empieza igual, 1 con errores, 0 no. */
function empate(buscada: string, palabra: string): number {
  if (palabra === buscada) return 3
  if (palabra.startsWith(buscada)) return 2
  const tol = tolerancia(buscada.length)
  if (tol === 0) return 0
  if (distancia(buscada, palabra, tol) <= tol) return 1
  // Mientras escribe: "bambe" contra el inicio de "bamboleo"
  if (palabra.length > buscada.length && distancia(buscada, palabra.slice(0, buscada.length), tol) <= tol) return 1
  return 0
}

export type IndiceCatalogo = { cancion: Cancion; titulo: string[]; artista: string[]; tituloCompleto: string }[]

/** Prepara el catálogo para buscar rápido (se hace una vez por cada cambio del catálogo). */
export function indexar(canciones: readonly Cancion[]): IndiceCatalogo {
  return canciones.map((cancion) => ({
    cancion,
    titulo: palabras(cancion.titulo),
    artista: palabras(cancion.artista),
    tituloCompleto: normalizar(cancion.titulo),
  }))
}

/**
 * Busca por título o artista, sin importar acentos, mayúsculas ni errores de dedo.
 * Las palabras cortas ("la", "de") no son obligatorias si hay alguna larga en la búsqueda.
 */
export function buscar(indice: IndiceCatalogo, consulta: string, limite = 50): Cancion[] {
  const buscadas = palabras(consulta)
  if (buscadas.length === 0) return []
  const hayLargas = buscadas.some((p) => p.length > 2)
  const frase = normalizar(consulta)

  const resultados: { cancion: Cancion; puntos: number }[] = []
  for (const item of indice) {
    let puntos = 0
    let descartada = false
    for (const buscada of buscadas) {
      let mejor = 0
      for (const p of item.titulo) mejor = Math.max(mejor, empate(buscada, p) * 1.2) // el título pesa más
      for (const p of item.artista) mejor = Math.max(mejor, empate(buscada, p))
      if (mejor === 0 && (buscada.length > 2 || !hayLargas)) {
        descartada = true
        break
      }
      puntos += mejor
    }
    if (descartada) continue
    if (item.tituloCompleto.startsWith(frase)) puntos += 3
    if (item.cancion.favorita) puntos += 0.5
    resultados.push({ cancion: item.cancion, puntos })
  }

  return resultados
    .sort((a, b) => b.puntos - a.puntos || a.cancion.titulo.localeCompare(b.cancion.titulo, 'es'))
    .slice(0, limite)
    .map((r) => r.cancion)
}

/** Clave para detectar canciones repetidas: mismo artista y título sin importar acentos ni signos. */
export function claveCancion(c: { titulo: string; artista: string }) {
  return `${normalizar(c.artista)}|${normalizar(c.titulo)}`
}
