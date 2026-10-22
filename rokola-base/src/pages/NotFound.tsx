import { ButtonLink, LogoMark } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center p-6 text-center">
      <div className="space-y-4">
        <LogoMark className="mx-auto size-20 text-lava" />
        <p className="text-title-1">Esta canción no está en el catálogo</p>
        <ButtonLink to="/">Volver al inicio</ButtonLink>
      </div>
    </div>
  )
}
