import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Button, ButtonLink, LogoMark } from '@/components/ui'

/** Pantalla de error de toda la app: atrapa fallos al cargar una vista o errores de código. */
export function RouteError() {
  const error = useRouteError()
  const detalle = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : String(error)

  return (
    <div className="grid min-h-dvh place-items-center p-6 text-center">
      <div className="w-full max-w-sm space-y-4">
        <LogoMark className="mx-auto size-20 text-lava" />
        <h1 className="text-title-1">Algo salió mal</h1>
        <p className="text-subhead text-grey">Vuelve a intentarlo en un momento.</p>
        {import.meta.env.DEV && (
          <pre className="overflow-x-auto rounded-field bg-surface p-3 text-left text-caption text-danger">
            {detalle}
          </pre>
        )}
        <div className="flex justify-center gap-2">
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
          <ButtonLink to="/" variant="secondary">
            Ir al inicio
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
