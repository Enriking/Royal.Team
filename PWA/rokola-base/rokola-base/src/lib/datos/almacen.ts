import type { Fila, NombreTabla } from './tipos'

/**
 * Dónde viven los datos de Rokola. Las características solo hablan con esta interfaz.
 * Hoy la implementa `AlmacenLocal` (localStorage, sincronizado entre pestañas del mismo navegador);
 * cuando exista el proyecto de Supabase, otra clase la implementará con la base y Realtime.
 */
export interface Almacen {
  /** Filas actuales. Devuelve la misma referencia mientras la tabla no cambie (apto para useSyncExternalStore). */
  filas<T extends NombreTabla>(tabla: T): readonly Fila<T>[]
  /** Avisa cada vez que la tabla cambia, aquí o en otra pestaña. Devuelve la función para dejar de escuchar. */
  suscribir(tabla: NombreTabla, aviso: () => void): () => void
  /** Inserta las filas; si ya existe una con el mismo id, la reemplaza. */
  guardar<T extends NombreTabla>(tabla: T, filas: Fila<T>[]): Promise<void>
  /**
   * Cambia campos de una fila. Con `si`, solo la cambia cuando todavía tiene esos valores
   * (evita pisar cambios: p. ej. cerrar una votación que ya cerró otra pestaña). Devuelve si la cambió.
   */
  actualizar<T extends NombreTabla>(
    tabla: T,
    id: string,
    cambios: Partial<Fila<T>>,
    si?: Partial<Fila<T>>,
  ): Promise<boolean>
  borrar(tabla: NombreTabla, ids: string[]): Promise<void>
}

export const TABLAS: NombreTabla[] = ['canciones', 'solicitudes', 'reacciones', 'calificaciones', 'ajustes']

type Disco = Pick<Storage, 'getItem' | 'setItem'>
type FilaConId = { id: string }

const PREFIJO = 'rokola:v1:'

/** Almacén en localStorage. Antes de cada cambio relee la tabla del disco para no pisar lo que escribió otra pestaña. */
export class AlmacenLocal implements Almacen {
  #disco: Disco
  #cache = new Map<NombreTabla, readonly FilaConId[]>()
  #avisos = new Map<NombreTabla, Set<() => void>>()

  constructor(disco: Disco) {
    this.#disco = disco
  }

  filas<T extends NombreTabla>(tabla: T): readonly Fila<T>[] {
    let filas = this.#cache.get(tabla)
    if (!filas) {
      filas = this.#leerDisco(tabla)
      this.#cache.set(tabla, filas)
    }
    return filas as readonly Fila<T>[]
  }

  suscribir(tabla: NombreTabla, aviso: () => void) {
    const avisos = this.#avisos.get(tabla) ?? new Set<() => void>()
    this.#avisos.set(tabla, avisos)
    avisos.add(aviso)
    return () => {
      avisos.delete(aviso)
    }
  }

  async guardar<T extends NombreTabla>(tabla: T, nuevas: Fila<T>[]) {
    if (nuevas.length === 0) return
    const porId = new Map<string, FilaConId>(nuevas.map((f) => [f.id, f]))
    const resultado = this.#leerDisco(tabla).map((f) => {
      const reemplazo = porId.get(f.id)
      porId.delete(f.id)
      return reemplazo ?? f
    })
    resultado.push(...porId.values())
    this.#escribir(tabla, resultado)
  }

  async actualizar<T extends NombreTabla>(tabla: T, id: string, cambios: Partial<Fila<T>>, si?: Partial<Fila<T>>) {
    let cambio = false
    const resultado = this.#leerDisco(tabla).map((f) => {
      if (f.id !== id || (si && !coincide(f, si))) return f
      cambio = true
      return { ...f, ...cambios }
    })
    if (cambio) this.#escribir(tabla, resultado)
    return cambio
  }

  async borrar(tabla: NombreTabla, ids: string[]) {
    if (ids.length === 0) return
    const quitar = new Set(ids)
    const actuales = this.#leerDisco(tabla)
    const resultado = actuales.filter((f) => !quitar.has(f.id))
    if (resultado.length !== actuales.length) this.#escribir(tabla, resultado)
  }

  /** Otra pestaña cambió el disco (evento `storage`). `clave` null significa que se borró todo. */
  recibirCambioExterno(clave: string | null) {
    if (clave !== null && !clave.startsWith(PREFIJO)) return
    const tablas = clave === null ? TABLAS : [clave.slice(PREFIJO.length) as NombreTabla]
    for (const tabla of tablas) {
      this.#cache.delete(tabla)
      this.#avisar(tabla)
    }
  }

  #leerDisco(tabla: NombreTabla): FilaConId[] {
    try {
      const texto = this.#disco.getItem(PREFIJO + tabla)
      const datos: unknown = texto ? JSON.parse(texto) : []
      return Array.isArray(datos) ? datos : []
    } catch {
      return []
    }
  }

  #escribir(tabla: NombreTabla, filas: FilaConId[]) {
    try {
      this.#disco.setItem(PREFIJO + tabla, JSON.stringify(filas))
    } catch (error) {
      throw new Error('Este dispositivo ya no tiene espacio para guardar más datos.', { cause: error })
    }
    this.#cache.set(tabla, filas)
    this.#avisar(tabla)
  }

  #avisar(tabla: NombreTabla) {
    this.#avisos.get(tabla)?.forEach((aviso) => aviso())
  }
}

function coincide(fila: object, valores: object) {
  return Object.entries(valores).every(([campo, valor]) => (fila as Record<string, unknown>)[campo] === valor)
}

/** Disco en memoria: para pruebas o cuando el navegador bloquea localStorage. */
export class DiscoMemoria implements Disco {
  #datos = new Map<string, string>()
  getItem(clave: string) {
    return this.#datos.get(clave) ?? null
  }
  setItem(clave: string, valor: string) {
    this.#datos.set(clave, valor)
  }
}
