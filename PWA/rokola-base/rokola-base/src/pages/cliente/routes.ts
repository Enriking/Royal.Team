import type { RouteObject } from 'react-router'
import { lazyPage } from '@/app/lazyPage'

/**
 * App del cliente.
 *  /m  → QR general del bar (pantalla y mesas). La mesa se escribe al pedir canción.
 */
export const clienteRoutes: RouteObject = {
  path: '/m',
  lazy: lazyPage(() => import('./Layout')),
  children: [
    { index: true, lazy: lazyPage(() => import('./Inicio')) },
    { path: 'buscar', lazy: lazyPage(() => import('./Buscar')) },
    { path: 'turno', lazy: lazyPage(() => import('./MiTurno')) },
    { path: 'ranking', lazy: lazyPage(() => import('./Ranking')) },
    // QR viejos de cada mesa (/m/12) → /m
    { path: ':mesa/*', lazy: { loader: async () => (await import('./mesaVieja')).loader } },
  ],
}
