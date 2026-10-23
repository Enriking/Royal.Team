import { nuevoId, type Cancion } from '@/lib/datos'
import { claveCancion } from './buscar'

export type CancionNueva = Pick<Cancion, 'titulo' | 'artista'> &
  Partial<Pick<Cancion, 'genero' | 'archivo' | 'favorita' | 'dueto'>>

/** Formatos de karaoke y de audio/video que se reconocen en la carpeta del DJ. */
export const EXTENSIONES = [
  'mp3',
  'mp4',
  'cdg',
  'kar',
  'mid',
  'midi',
  'm4a',
  'wav',
  'ogg',
  'flac',
  'mkv',
  'avi',
  'webm',
]
const RE_EXTENSION = new RegExp(`\\.(${EXTENSIONES.join('|')}|zip)$`, 'i')

/** Etiquetas entre paréntesis o corchetes que no son parte del título. */
const RE_RUIDO =
  /\s*[([]\s*(karaoke|instrumental|pista|version|versión|hd|lyrics?|letra|con letra|official|oficial|audio|video|kara)[^)\]]*[)\]]/gi

/** Números de pista o claves de disco al inicio: "01 - ", "12. ", "SF045-07 ". */
const RE_PISTA = /^\s*(?:\d{1,4}\s*[-._)]+|[a-z]{2,5}\d{3,6}(?:-\d{1,3})?\s*[-._)]*)\s*/i

const limpiar = (texto: string) => texto.replace(/\s+/g, ' ').trim()

export function esArchivoDeMusica(nombre: string) {
  return RE_EXTENSION.test(nombre)
}

/**
 * Saca título y artista del nombre de un archivo: "01 - Maná - Rayando el sol (Karaoke).mp3".
 * Por convención es "Artista - Título"; con `invertir` se lee "Título - Artista".
 */
export function parsearArchivo(ruta: string, invertir = false): CancionNueva | null {
  const archivo = ruta.split(/[/\\]/).pop() ?? ''
  const cancion = parsearNombre(archivo, invertir)
  return cancion && { ...cancion, archivo }
}

function parsearNombre(nombre: string, invertir: boolean): CancionNueva | null {
  const base = limpiar(nombre.replace(RE_EXTENSION, '').replace(/_/g, ' ').replace(RE_RUIDO, '')).replace(RE_PISTA, '')
  let partes = base
    .split(/\s+[-–—]\s+/)
    .map(limpiar)
    .filter(Boolean)
  // "Artista-Título" sin espacios: solo si hay un único guion (para no partir títulos como "Ay-ay-ay")
  if (partes.length === 1 && base.split('-').length === 2) partes = base.split('-').map(limpiar).filter(Boolean)
  if (partes.length === 0) return null

  if (partes.length === 1) return { titulo: partes[0], artista: '' }
  return invertir
    ? { titulo: partes.slice(0, -1).join(' - '), artista: partes.at(-1)! }
    : { artista: partes[0], titulo: partes.slice(1).join(' - ') }
}

/**
 * Lee una lista pegada a mano. Cada renglón puede ser:
 *  - copiado de una hoja de cálculo (columnas separadas por tabulador): Título, Artista, Género
 *  - texto "Artista - Título" (o "Título - Artista" con `invertir`)
 */
export function parsearTexto(texto: string, invertir = false): CancionNueva[] {
  const canciones: CancionNueva[] = []
  for (const renglon of texto.split(/\r?\n/)) {
    if (!renglon.trim()) continue
    if (renglon.includes('\t')) {
      const [titulo = '', artista = '', genero = ''] = renglon.split('\t').map(limpiar)
      if (!titulo || /^t[ií]tulo$/i.test(titulo)) continue // renglón vacío o encabezado
      canciones.push({ titulo, artista, genero: genero || null })
    } else {
      const cancion = parsearNombre(renglon, invertir)
      if (cancion) canciones.push(cancion)
    }
  }
  return canciones
}

/** Nombre de la carpeta que contiene el archivo (para usarla como género). */
export function carpetaDe(ruta: string): string | null {
  const partes = ruta.split(/[/\\]/)
  return partes.length > 2 ? limpiar(partes.at(-2)!) : null
}

/** Convierte las candidatas en canciones nuevas, quitando las que ya están en el catálogo o vienen repetidas. */
export function sinRepetidas(existentes: readonly Cancion[], candidatas: CancionNueva[]): Cancion[] {
  const vistas = new Set(existentes.map(claveCancion))
  const creada_en = new Date().toISOString()
  const nuevas: Cancion[] = []
  for (const c of candidatas) {
    const titulo = limpiar(c.titulo)
    if (!titulo) continue
    const clave = claveCancion({ titulo, artista: c.artista })
    if (vistas.has(clave)) continue
    vistas.add(clave)
    nuevas.push({
      id: nuevoId(),
      titulo,
      artista: limpiar(c.artista),
      genero: c.genero ? limpiar(c.genero) : null,
      favorita: c.favorita ?? false,
      dueto: c.dueto ?? false,
      archivo: c.archivo ?? null,
      creada_en,
    })
  }
  return nuevas
}
