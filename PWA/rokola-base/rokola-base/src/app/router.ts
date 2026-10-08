import { createBrowserRouter } from 'react-router'
import { lazyPage } from '@/app/lazyPage'
import { PageLoader } from '@/components/layout/PageLoader'
import { RouteError } from '@/components/layout/RouteError'
import { clienteRoutes } from '@/pages/cliente/routes'
import { djRoutes } from '@/pages/dj/routes'
import { duenoRoutes } from '@/pages/dueno/routes'

/**
 * Mapa de rutas de Rokola
 *  /            → hub de desarrollo
 *  /m/:mesa     → app del cliente (QR de cada mesa)  · sus rutas en pages/cliente/routes.ts
 *  /dj          → panel del DJ                       · pages/dj/routes.ts
 *  /dueno       → panel del dueño                    · pages/dueno/routes.ts
 *  /pantalla    → TV del bar
 *  /design      → sistema de diseño
 */
export const router = createBrowserRouter([
  {
    // Raíz sin ruta propia: muestra la carga inicial y atrapa los errores de cualquier vista
    HydrateFallback: PageLoader,
    ErrorBoundary: RouteError,
    children: [
      { path: '/', lazy: lazyPage(() => import('@/pages/Hub')) },
      clienteRoutes,
      djRoutes,
      duenoRoutes,
      { path: '/pantalla', lazy: lazyPage(() => import('@/pages/pantalla/Rocola')) },
      { path: '/design', lazy: lazyPage(() => import('@/pages/design/SistemaDiseno')) },
      { path: '*', lazy: lazyPage(() => import('@/pages/NotFound')) },
    ],
  },
])
