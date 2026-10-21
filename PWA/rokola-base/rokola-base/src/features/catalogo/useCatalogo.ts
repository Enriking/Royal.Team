import { useDeferredValue, useMemo } from 'react'
import { useTabla } from '@/lib/datos'
import { buscar, indexar } from './buscar'
import { generos, listasCuradas } from './listas'

/** Resultados de búsqueda en el catálogo. Mientras se escribe, la lista se actualiza sin trabar el teclado. */
export function useBusqueda(consulta: string, limite = 50) {
  const canciones = useTabla('canciones')
  const indice = useMemo(() => indexar(canciones), [canciones])
  const diferida = useDeferredValue(consulta)
  const resultados = useMemo(() => buscar(indice, diferida, limite), [indice, diferida, limite])
  return { resultados, buscando: diferida !== consulta, totalCatalogo: canciones.length }
}

export function useListas() {
  const canciones = useTabla('canciones')
  const solicitudes = useTabla('solicitudes')
  return useMemo(() => listasCuradas(canciones, solicitudes), [canciones, solicitudes])
}

export function useGeneros() {
  const canciones = useTabla('canciones')
  return useMemo(() => generos(canciones), [canciones])
}
