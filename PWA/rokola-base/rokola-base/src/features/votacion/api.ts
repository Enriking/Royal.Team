import { ahoraIso, almacen, dispositivoId, leerAjustes, nuevoId, type Solicitud } from '@/lib/datos'
import { reaccionesRestantes, resultadoVotacion } from './puntaje'

const buscar = (id: string) => almacen.filas('solicitudes').find((s) => s.id === id)

/** Reacción con emoji mientras alguien canta o se califica (máximo por celular, ver Ajustes). */
export async function reaccionar(solicitud: Solicitud, emoji: string) {
  if (solicitud.estado !== 'cantando' && solicitud.estado !== 'valorando') {
    throw new Error('Esta canción ya no recibe reacciones.')
  }
  const yo = dispositivoId()
  const { max_reacciones } = leerAjustes()
  if (reaccionesRestantes(almacen.filas('reacciones'), solicitud.id, yo, max_reacciones) === 0) {
    throw new Error(`Ya mandaste tus ${max_reacciones} reacciones para esta canción.`)
  }
  await almacen.guardar('reacciones', [
    {
      id: nuevoId(),
      noche: solicitud.noche,
      solicitud_id: solicitud.id,
      dispositivo_id: yo,
      emoji,
      creada_en: ahoraIso(),
    },
  ])
}

/** Un voto por celular; si vuelve a votar, se cambia su voto. */
export async function calificar(solicitud: Solicitud, valor: 1 | 2 | 3) {
  if (solicitud.estado !== 'valorando') throw new Error('La votación de esta canción ya cerró.')
  const yo = dispositivoId()
  if (solicitud.dispositivo_id === yo) throw new Error('No puedes calificar tu propia canción 😉')
  await almacen.guardar('calificaciones', [
    {
      id: `${solicitud.id}:${yo}`,
      noche: solicitud.noche,
      solicitud_id: solicitud.id,
      dispositivo_id: yo,
      valor,
      creada_en: ahoraIso(),
    },
  ])
}

/** Guarda el pico del aplausómetro (solo si supera al anterior y la votación sigue abierta). */
export async function registrarAplausos(id: string, nivel: number) {
  const solicitud = buscar(id)
  if (!solicitud || solicitud.estado !== 'valorando' || (solicitud.aplausos ?? -1) >= nivel) return
  await almacen.actualizar('solicitudes', id, { aplausos: nivel }, { estado: 'valorando' })
}

/** Cierra la votación y guarda el puntaje. Si ya la cerró otra pestaña, no hace nada. */
export async function cerrarVotacion(id: string) {
  const solicitud = buscar(id)
  if (!solicitud || solicitud.estado !== 'valorando') return false
  const resultado = resultadoVotacion(
    solicitud,
    almacen.filas('reacciones'),
    almacen.filas('calificaciones'),
    leerAjustes(),
  )
  return almacen.actualizar(
    'solicitudes',
    id,
    { estado: 'terminada', cerrada_en: ahoraIso(), ...resultado },
    { estado: 'valorando' },
  )
}
