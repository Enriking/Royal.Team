import type { RouteObject } from 'react-router'
import { lazyPage } from '@/app/lazyPage'

/** App del cliente: se abre desde el QR de cada mesa (/m/12). */
export const clienteRoutes: RouteObject = {
  path: '/m/:mesa',
  lazy: lazyPage(() => import('./Layout')),
  children: [
    { index: true, lazy: lazyPage(() => import('./Inicio')) },
    { path: 'buscar', lazy: lazyPage(() => import('./Buscar')) },
    { path: 'turno', lazy: lazyPage(() => import('./MiTurno')) },
    { path: 'ranking', lazy: lazyPage(() => import('./Ranking')) },
  ],
}
