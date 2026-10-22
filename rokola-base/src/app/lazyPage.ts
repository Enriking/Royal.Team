import type { ComponentType } from 'react'

/**
 * Carga una vista solo cuando se visita. Así cada área (cliente, DJ, pantalla, dueño) queda en su
 * propio archivo JS y la primera carga solo trae el código de la vista abierta.
 * La vista debe exportar su componente por defecto (`export default function …`).
 */
export function lazyPage(load: () => Promise<{ default: ComponentType }>) {
  return { Component: async () => (await load()).default }
}
