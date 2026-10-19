import { useEffect, useMemo } from 'react'
import { almacen, dispositivoId, leerAjustes, useAjustes, useTabla, type Solicitud } from '@/lib/datos'
import { cerrarVotacion } from './api'
import { reaccionesRestantes, resultadoVotacion } from './puntaje'

export function useReacciones(solicitudId: string | undefined) {
  const reacciones = useTabla('reacciones')
  return useMemo(() => reacciones.filter((r) => r.solicitud_id === solicitudId), [reacciones, solicitudId])
}

export function useReaccionesRestantes(solicitudId: string) {
  const reacciones = useTabla('reacciones')
  const { max_reacciones } = useAjustes()
  return reaccionesRestantes(reacciones, solicitudId, dispositivoId(), max_reacciones)
}

export function useMiCalificacion(solicitudId: string): 1 | 2 | 3 | null {
  const calificaciones = useTabla('calificaciones')
  const id = `${solicitudId}:${dispositivoId()}`
  return calificaciones.find((c) => c.id === id)?.valor ?? null
}

/** Conteo en vivo de una votación (para el DJ y la pantalla), con el puntaje que tendría si cerrara ahora. */
export function useVotacionEnVivo(solicitud: Solicitud) {
  const reacciones = useTabla('reacciones')
  const calificaciones = useTabla('calificaciones')
  const ajustes = useAjustes()
  return useMemo(() => {
    const votos = calificaciones.filter((c) => c.solicitud_id === solicitud.id).length
    const totalReacciones = reacciones.filter((r) => r.solicitud_id === solicitud.id).length
    return { votos, totalReacciones, ...resultadoVotacion(solicitud, reacciones, calificaciones, ajustes) }
  }, [solicitud, reacciones, calificaciones, ajustes])
}

/** Segundos que le quedan a la votación (0 si ya venció). */
export function segundosRestantes(solicitud: Solicitud, segundosVotacion: number, ahora: number) {
  if (!solicitud.fin_en) return 0
  const vence = new Date(solicitud.fin_en).getTime() + segundosVotacion * 1000
  return Math.max(0, Math.ceil((vence - ahora) / 1000))
}

/**
 * Cierra solas las votaciones vencidas. Se monta en el panel del DJ y en la pantalla del bar;
 * si las dos lo hacen a la vez no pasa nada (el cierre solo ocurre una vez).
 */
export function useCierreAutomatico() {
  useEffect(() => {
    const revisar = () => {
      const { segundos_votacion } = leerAjustes()
      const ahora = Date.now()
      for (const s of almacen.filas('solicitudes')) {
        if (s.estado === 'valorando' && segundosRestantes(s, segundos_votacion, ahora) === 0) void cerrarVotacion(s.id)
      }
    }
    revisar()
    const t = setInterval(revisar, 1000)
    return () => clearInterval(t)
  }, [])
}
