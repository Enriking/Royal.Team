import type { RouteObject } from 'react-router'
import { lazyPage } from '@/app/lazyPage'

/** Panel del dueño. */
export const duenoRoutes: RouteObject = {
  path: '/dueno',
  lazy: lazyPage(() => import('./Layout')),
  children: [
    { index: true, lazy: lazyPage(() => import('./Panel')) },
    { path: 'ajustes', lazy: lazyPage(() => import('./Ajustes')) },
  ],
}
