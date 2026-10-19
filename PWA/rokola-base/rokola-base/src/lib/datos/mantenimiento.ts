import { TABLAS } from './almacen'
import { almacen } from './instancia'

/** Borra solicitudes, reacciones y votos de una noche (el catálogo y los ajustes se quedan). */
export async function borrarNoche(noche: string) {
  for (const tabla of ['solicitudes', 'reacciones', 'calificaciones'] as const) {
    await almacen.borrar(
      tabla,
      almacen
        .filas(tabla)
        .filter((f) => f.noche === noche)
        .map((f) => f.id),
    )
  }
}

/** Deja la app como nueva: borra todas las tablas (incluidos catálogo y ajustes). */
export async function borrarTodo() {
  for (const tabla of TABLAS) {
    await almacen.borrar(
      tabla,
      almacen.filas(tabla).map((f) => f.id),
    )
  }
}
