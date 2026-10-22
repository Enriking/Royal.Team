import { useMemo } from 'react'
import { mesDe, nocheMenos, useNoche, useTabla } from '@/lib/datos'
import { estadisticas } from './estadisticas'
import { salonDeLaFama, topNoche } from './ranking'

export function useTopNoche(limite = 10) {
  const solicitudes = useTabla('solicitudes')
  const noche = useNoche()
  return useMemo(() => topNoche(solicitudes, noche, limite), [solicitudes, noche, limite])
}

export function useSalonDeLaFama(limite = 10) {
  const solicitudes = useTabla('solicitudes')
  const mes = mesDe(useNoche())
  return { mes, registros: useMemo(() => salonDeLaFama(solicitudes, mes, limite), [solicitudes, mes, limite]) }
}

export type Periodo = 'noche' | 'semana' | 'mes'

/** Estadísticas para el panel del dueño: esta noche, los últimos 7 días o este mes. */
export function useEstadisticas(periodo: Periodo) {
  const solicitudes = useTabla('solicitudes')
  const canciones = useTabla('canciones')
  const hoy = useNoche()
  return useMemo(() => {
    const desde = nocheMenos(hoy, 6)
    const delPeriodo = solicitudes.filter((s) =>
      periodo === 'noche' ? s.noche === hoy : periodo === 'semana' ? s.noche >= desde : mesDe(s.noche) === mesDe(hoy),
    )
    return estadisticas(delPeriodo, canciones)
  }, [solicitudes, canciones, hoy, periodo])
}
