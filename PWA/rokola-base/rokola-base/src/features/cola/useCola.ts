import { useEffect, useMemo, useRef } from 'react'
import { avisar } from '@/components/ui'
import { dispositivoId, useAjustes, useNoche, useTabla, type Solicitud } from '@/lib/datos'
import { armarFila, esperaEstimada, PENDIENTES, turnosAntes } from './reglas'

/** Solicitudes de la noche actual. */
export function useSolicitudesNoche(): Solicitud[] {
  const todas = useTabla('solicitudes')
  const noche = useNoche()
  return useMemo(() => todas.filter((s) => s.noche === noche), [todas, noche])
}

export function useFila() {
  const noche = useSolicitudesNoche()
  return useMemo(() => armarFila(noche), [noche])
}

export type MiSolicitud = Solicitud & {
  /** Turnos antes de la suya (null si no está en la fila). */
  turnos: number | null
  /** Minutos aproximados (null si no está en la fila). */
  minutos: number | null
}

/** Solicitudes de esta noche hechas desde este celular, la más reciente primero, con su lugar en la fila. */
export function useMisSolicitudes(): MiSolicitud[] {
  const noche = useSolicitudesNoche()
  const fila = useFila()
  const { minutos_por_turno } = useAjustes()
  return useMemo(() => {
    const yo = dispositivoId()
    return noche
      .filter((s) => s.dispositivo_id === yo)
      .sort((a, b) => b.creada_en.localeCompare(a.creada_en))
      .map((s) => {
        const turnos = turnosAntes(fila, s.id)
        const minutos = turnos === null ? null : esperaEstimada(turnos, !!fila.cantando, minutos_por_turno)
        return { ...s, turnos, minutos }
      })
  }, [noche, fila, minutos_por_turno])
}

/** La canción de este celular más próxima a cantarse (o la que está cantando). */
export function proximaMia(mias: MiSolicitud[]): MiSolicitud | null {
  const activas = mias.filter((s) => PENDIENTES.includes(s.estado) || s.estado === 'cantando')
  return activas.sort((a, b) => (a.turnos ?? 99) - (b.turnos ?? 99))[0] ?? null
}

const vibrar = (patron: number | number[]) => {
  if ('vibrate' in navigator) navigator.vibrate(patron)
}

/**
 * Avisa con vibración y un mensaje cuando a una canción de este celular le faltan 2 turnos y cuando la llaman.
 * Se monta una vez en el marco del cliente.
 */
export function useAvisoTurno(mias: MiSolicitud[]) {
  const avisados = useRef<Set<string> | null>(null)

  useEffect(() => {
    // Al abrir la app no se repiten rechazos viejos; la llamada y "ya casi" sí se avisan
    if (!avisados.current) {
      avisados.current = new Set(mias.filter((s) => s.estado === 'rechazada').map((s) => `${s.id}:rechazada`))
    }
    const avisarUnaVez = (s: MiSolicitud, tipo: string, avisoFn: () => void) => {
      const clave = `${s.id}:${tipo}`
      if (avisados.current!.has(clave)) return
      avisados.current!.add(clave)
      avisoFn()
    }

    for (const s of mias) {
      if (s.estado === 'llamada') {
        avisarUnaVez(s, 'llamada', () => {
          vibrar([300, 120, 300, 120, 600])
          avisar(`¡Te toca, ${s.nombre}! Pasa al escenario 🎤`)
        })
      } else if (s.estado === 'aprobada' && s.turnos !== null && s.turnos <= 1) {
        avisarUnaVez(s, 'cerca', () => {
          vibrar(250)
          avisar(s.turnos === 0 ? `${s.nombre}, eres quien sigue` : `${s.nombre}, solo falta una persona antes que tú`)
        })
      } else if (s.estado === 'rechazada') {
        avisarUnaVez(s, 'rechazada', () =>
          avisar(`El DJ no pudo aceptar “${s.titulo}”${s.motivo_rechazo ? `: ${s.motivo_rechazo}` : ''}`, 'error'),
        )
      }
    }
  }, [mias])
}
