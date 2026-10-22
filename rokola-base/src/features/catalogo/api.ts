import { almacen, type Cancion } from '@/lib/datos'
import { CATALOGO_DEMO } from './demo'
import { sinRepetidas, type CancionNueva } from './importar'

/** Agrega canciones al catálogo saltando las repetidas. Devuelve cuántas se agregaron. */
export async function agregarCanciones(candidatas: CancionNueva[]): Promise<number> {
  const nuevas = sinRepetidas(almacen.filas('canciones'), candidatas)
  await almacen.guardar('canciones', nuevas)
  return nuevas.length
}

export function cargarCatalogoDemo() {
  return agregarCanciones(CATALOGO_DEMO)
}

export async function actualizarCancion(id: string, cambios: Partial<Omit<Cancion, 'id' | 'creada_en'>>) {
  await almacen.actualizar('canciones', id, cambios)
}

export function borrarCanciones(ids: string[]) {
  return almacen.borrar('canciones', ids)
}
