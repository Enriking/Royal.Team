import type { RouteObject } from 'react-router'
import { lazyPage } from '@/app/lazyPage'

/** Panel del DJ. */
export const djRoutes: RouteObject = {
  path: '/dj',
  lazy: lazyPage(() => import('./Layout')),
  children: [
    { index: true, lazy: lazyPage(() => import('./Bandeja')) },
    { path: 'fila', lazy: lazyPage(() => import('./Fila')) },
  ],
}
