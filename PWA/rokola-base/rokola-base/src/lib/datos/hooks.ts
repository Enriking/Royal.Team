import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { useAhora } from '@/lib/useAhora'
import { ajustesDe } from './ajustes'
import { almacen } from './instancia'
import { nocheDe } from './noche'
import type { Ajustes, Fila, NombreTabla } from './tipos'

/** Filas de una tabla; el componente se vuelve a dibujar cuando cambian (aquí o en otra pestaña). */
export function useTabla<T extends NombreTabla>(tabla: T): readonly Fila<T>[] {
  const suscribir = useCallback((aviso: () => void) => almacen.suscribir(tabla, aviso), [tabla])
  const leer = useCallback(() => almacen.filas(tabla), [tabla])
  return useSyncExternalStore(suscribir, leer)
}

export function useAjustes(): Ajustes {
  const filas = useTabla('ajustes')
  return useMemo(() => ajustesDe(filas), [filas])
}

/** Noche actual del bar; cambia sola a la hora de corte. */
export function useNoche(): string {
  const ahora = useAhora(60_000)
  return useMemo(() => nocheDe(new Date(ahora)), [ahora])
}
