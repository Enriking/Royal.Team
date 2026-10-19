import { ahoraIso, almacen, dispositivoId, leerAjustes, nocheDe, nuevoId, type Solicitud } from '@/lib/datos'
import {
  armarFila,
  intercambio,
  limpiarIniciales,
  PENDIENTES,
  puedePedir,
  rondaPara,
  siguienteOrden,
  validarPedido,
  type DatosPedido,
} from './reglas'

const deLaNoche = (noche: string) => almacen.filas('solicitudes').filter((s) => s.noche === noche)

function buscarSolicitud(id: string): Solicitud {
  const solicitud = almacen.filas('solicitudes').find((s) => s.id === id)
  if (!solicitud) throw new Error('Esa solicitud ya no existe.')
  return solicitud
}

/** Cambia el estado solo si sigue en `desde` (otra pestaña pudo moverla). */
async function pasar(id: string, desde: Solicitud['estado'], cambios: Partial<Solicitud>, error: string) {
  const cambio = await almacen.actualizar('solicitudes', id, cambios, { estado: desde })
  if (!cambio) throw new Error(error)
}

// ——— Cliente ———

export async function pedirCancion(datos: DatosPedido): Promise<Solicitud> {
  const ajustes = leerAjustes()
  const error = validarPedido(datos, ajustes.total_mesas)
  if (error) throw new Error(error)

  const noche = nocheDe()
  const permiso = puedePedir(deLaNoche(noche), datos.cantante_id, ajustes)
  if (!permiso.ok) throw new Error(permiso.motivo)

  const solicitud: Solicitud = {
    id: nuevoId(),
    noche,
    creada_en: ahoraIso(),
    mesa: datos.mesa,
    dispositivo_id: dispositivoId(),
    cantante_id: datos.cantante_id,
    nombre: datos.nombre.trim(),
    iniciales: limpiarIniciales(datos.iniciales),
    cancion_id: datos.cancion_id,
    titulo: datos.titulo.trim(),
    artista: datos.artista.trim(),
    dueto_con: datos.dueto_con?.trim() || null,
    nota: datos.nota?.trim() || null,
    compite: datos.compite,
    estado: 'en_revision',
    motivo_rechazo: null,
    ronda: null,
    orden: null,
    aprobada_en: null,
    llamada_en: null,
    inicio_en: null,
    fin_en: null,
    cerrada_en: null,
    aplausos: null,
    energia: null,
    calificacion: null,
    puntaje: null,
  }
  await almacen.guardar('solicitudes', [solicitud])
  return solicitud
}

/** El cliente cancela su canción mientras no la esté cantando. */
export async function cancelarSolicitud(id: string) {
  const { estado } = buscarSolicitud(id)
  if (!PENDIENTES.includes(estado)) throw new Error('Esta canción ya no se puede cancelar.')
  await pasar(id, estado, { estado: 'cancelada', motivo_rechazo: 'Cancelada por el cliente' }, 'No se pudo cancelar.')
}

// ——— DJ ———

export async function aprobar(id: string) {
  const solicitud = buscarSolicitud(id)
  const noche = deLaNoche(solicitud.noche)
  await pasar(
    id,
    'en_revision',
    {
      estado: 'aprobada',
      ronda: rondaPara(noche, solicitud.cantante_id, id),
      orden: siguienteOrden(noche),
      aprobada_en: ahoraIso(),
    },
    'Esta solicitud ya fue revisada.',
  )
}

export function rechazar(id: string, motivo: string) {
  return pasar(
    id,
    'en_revision',
    { estado: 'rechazada', motivo_rechazo: motivo.trim() || null },
    'Esta solicitud ya fue revisada.',
  )
}

/** Sube o baja un turno en la fila. */
export async function mover(id: string, direccion: 'subir' | 'bajar') {
  const cambios = intercambio(armarFila(deLaNoche(buscarSolicitud(id).noche)).enEspera, id, direccion)
  if (!cambios) return
  for (const { id: idCambio, ronda, orden } of cambios)
    await almacen.actualizar('solicitudes', idCambio, { ronda, orden })
}

/** El DJ saca una canción aprobada de la fila. */
export function quitarDeFila(id: string) {
  return pasar(
    id,
    'aprobada',
    { estado: 'cancelada', motivo_rechazo: 'El DJ la quitó de la fila' },
    'Esta canción ya no está en la fila.',
  )
}

/** Llama a la persona para que pase al escenario (le vibra el celular). */
export async function llamar(id: string) {
  const fila = armarFila(deLaNoche(buscarSolicitud(id).noche))
  if (fila.llamada) throw new Error(`Ya está llamada ${fila.llamada.nombre}. Empieza o salta su turno primero.`)
  await pasar(id, 'aprobada', { estado: 'llamada', llamada_en: ahoraIso() }, 'Esta canción ya no está en la fila.')
}

/** No llegó cuando se le llamó: pasa al final de su ronda. */
export async function saltar(id: string) {
  const noche = deLaNoche(buscarSolicitud(id).noche)
  await pasar(
    id,
    'llamada',
    { estado: 'aprobada', llamada_en: null, orden: siguienteOrden(noche) },
    'Esta persona ya no está llamada.',
  )
}

export function noSePresento(id: string) {
  return pasar(
    id,
    'llamada',
    { estado: 'cancelada', motivo_rechazo: 'No se presentó' },
    'Esta persona ya no está llamada.',
  )
}

/** Empieza a cantar (desde llamada o directo desde la fila). */
export async function empezar(id: string) {
  const solicitud = buscarSolicitud(id)
  const fila = armarFila(deLaNoche(solicitud.noche))
  if (fila.cantando) throw new Error(`${fila.cantando.nombre} sigue cantando. Marca que terminó primero.`)
  if (solicitud.estado !== 'llamada' && solicitud.estado !== 'aprobada')
    throw new Error('Esta canción ya no está en la fila.')
  await pasar(
    id,
    solicitud.estado,
    { estado: 'cantando', inicio_en: ahoraIso() },
    'Esta canción ya no está en la fila.',
  )
}

/** Terminó de cantar: se abre la votación del público. */
export function terminar(id: string) {
  return pasar(id, 'cantando', { estado: 'valorando', fin_en: ahoraIso() }, 'Esta persona ya no está cantando.')
}
