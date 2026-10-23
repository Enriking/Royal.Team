import { useSyncExternalStore } from 'react'
import { nuevoId } from '@/lib/datos'
import { limpiarIniciales } from './reglas'

/**
 * Personas que cantan desde este celular. Un grupo de amigos puede compartir teléfono,
 * y la fila justa cuenta por persona, no por celular.
 */
export type Perfil = { id: string; nombre: string; iniciales: string }

const CLAVE = 'rokola:perfiles'
const oyentes = new Set<() => void>()
let cache: Perfil[] | undefined

function leer(): Perfil[] {
  if (cache) return cache
  try {
    const datos: unknown = JSON.parse(localStorage.getItem(CLAVE) ?? '[]')
    cache = Array.isArray(datos) ? datos : []
  } catch {
    cache = []
  }
  return cache
}

function escribir(perfiles: Perfil[]) {
  cache = perfiles
  try {
    localStorage.setItem(CLAVE, JSON.stringify(perfiles))
  } catch {
    // sin almacenamiento: quedan solo mientras la pestaña esté abierta
  }
  oyentes.forEach((o) => o())
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente)
  const alCambiarFuera = (e: StorageEvent) => {
    if (e.key !== CLAVE && e.key !== null) return
    cache = undefined
    oyente()
  }
  window.addEventListener('storage', alCambiarFuera)
  return () => {
    oyentes.delete(oyente)
    window.removeEventListener('storage', alCambiarFuera)
  }
}

export function usePerfiles(): Perfil[] {
  return useSyncExternalStore(suscribir, leer)
}

/** Id de la persona con ese nombre en este celular, o uno nuevo si no existe. */
export function idParaNombre(nombre: string): string {
  const buscado = nombre.trim().toLowerCase()
  return leer().find((p) => p.nombre.toLowerCase() === buscado)?.id ?? nuevoId()
}

/** Guarda (o actualiza) a la persona y la deja primera en la lista. */
export function guardarPerfil({ id, nombre, iniciales }: Perfil) {
  const perfil = { id, nombre: nombre.trim(), iniciales: limpiarIniciales(iniciales) }
  escribir([perfil, ...leer().filter((p) => p.id !== id)])
}

export function quitarPerfil(id: string) {
  escribir(leer().filter((p) => p.id !== id))
}
