import { TriangleAlert } from 'lucide-react'
import { Card, Qr } from '@/components/ui'
import { cn } from '@/lib/cn'
import { enlaceCliente, qrApuntaALocal, useAjustes } from '@/lib/datos'

/** QR general del bar: lleva a la app del cliente para pedir canción. */
export function QrUnirse({ className }: { className?: string }) {
  const ajustes = useAjustes()
  const enlace = enlaceCliente(ajustes)

  return (
    <Card variant="lava" className={cn('flex items-center gap-6', className)}>
      <Qr valor={enlace} titulo="QR para pedir canción" className="size-40 shrink-0 rounded-xl" />
      <div className="min-w-0 space-y-2">
        <p className="text-title-1 leading-tight">Escanea y pide tu canción</p>
        <p className="truncate text-headline font-normal text-jet/70">{enlace.replace(/^https?:\/\//, '')}</p>
        {qrApuntaALocal(ajustes) && (
          <p className="flex gap-2 text-caption">
            <TriangleAlert className="size-4 shrink-0" />
            Los celulares no abren “localhost”: abre esta pantalla con la dirección “Network” que muestra npm run dev, o
            pon la dirección pública en Ajustes del dueño.
          </p>
        )}
      </div>
    </Card>
  )
}
