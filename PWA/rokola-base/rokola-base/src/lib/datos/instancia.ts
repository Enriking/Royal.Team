import { AlmacenLocal, DiscoMemoria, type Almacen } from './almacen'
import { nocheDe, nocheMenos } from './noche'

/**
 * Almacén único de la app.
 * Sin Supabase, los datos viven en este navegador: cliente, DJ y pantalla se sincronizan entre pestañas,
 * pero un celular no ve lo que pasa en la PC (eso llegará al conectar Supabase).
 */
export const almacen: Almacen = crearAlmacen()

function crearAlmacen() {
  let disco: Storage | DiscoMemoria
  try {
    disco = window.localStorage
  } catch {
    disco = new DiscoMemoria() // pruebas en Node o almacenamiento bloqueado
  }
  const local = new AlmacenLocal(disco)
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.storageArea === disco) local.recibirCambioExterno(e.key)
    })
    void podar(local)
  }
  return local
}

/**
 * localStorage guarda ~5 MB. Las reacciones y votos de noches pasadas ya quedaron resumidos en su solicitud,
 * así que se borran; las solicitudes se guardan dos meses (para el salón de la fama).
 */
async function podar(local: Almacen) {
  const hoy = nocheDe()
  const ayer = nocheMenos(hoy, 1)
  const viejas = <T extends { id: string; noche: string }>(filas: readonly T[], limite: string) =>
    filas.filter((f) => f.noche < limite).map((f) => f.id)

  await local.borrar('reacciones', viejas(local.filas('reacciones'), ayer))
  await local.borrar('calificaciones', viejas(local.filas('calificaciones'), ayer))
  await local.borrar('solicitudes', viejas(local.filas('solicitudes'), nocheMenos(hoy, 62)))
}
