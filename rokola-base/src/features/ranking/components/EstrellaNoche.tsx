import { Crown } from 'lucide-react'
import { Card } from '@/components/ui'
import { nivelDe } from '@/features/votacion'
import type { Solicitud } from '@/lib/datos'

/** La mejor actuación de la noche. */
export function EstrellaNoche({ solicitud }: { solicitud: Solicitud }) {
  return (
    <Card className="space-y-2 bg-gradient-black-orange text-center">
      <Crown className="mx-auto size-9" />
      <p className="text-caption tracking-[0.25em] uppercase">Estrella de la noche</p>
      <p className="font-mono text-large-title tracking-[0.2em]">{solicitud.iniciales}</p>
      <p className="text-headline">
        {solicitud.nombre} · {solicitud.titulo}
      </p>
      <p className="text-title-2">
        {solicitud.puntaje} pts · {nivelDe(solicitud.puntaje ?? 0).texto}
      </p>
    </Card>
  )
}
