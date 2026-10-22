import { LogoMark } from '@/components/ui'

/** Se muestra mientras llega el código de la vista. Aparece con retraso para no parpadear en cargas rápidas. */
export function PageLoader() {
  return (
    <output className="grid min-h-dvh place-items-center" aria-label="Cargando">
      <LogoMark className="size-16 animate-latido text-lava motion-reduce:animate-none" />
    </output>
  )
}
