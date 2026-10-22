import { Badge, Button, Card, conAviso } from '@/components/ui'
import { useAjustes, type Solicitud } from '@/lib/datos'
import { useAhora } from '@/lib/useAhora'
import { cerrarVotacion } from '../api'
import { segundosRestantes, useVotacionEnVivo } from '../useVotacion'

/** Votación en curso para el DJ: conteo en vivo, cuenta regresiva y botón para cerrarla antes. */
export function VotacionDj({ solicitud }: { solicitud: Solicitud }) {
  const vivo = useVotacionEnVivo(solicitud)
  const { segundos_votacion } = useAjustes()
  const ahora = useAhora()
  const quedan = segundosRestantes(solicitud, segundos_votacion, ahora)

  const datos = [
    ['Votos', vivo.votos ? `${vivo.votos} · ${vivo.calificacion} / 3` : '0'],
    ['Reacciones', String(vivo.totalReacciones)],
    ['Aplausos', vivo.aplausos === null ? 'sin micro' : String(vivo.aplausos)],
    ['Puntaje', vivo.puntaje === null ? '—' : String(vivo.puntaje)],
  ]

  return (
    <Card variant="outline" className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline">Votación</Badge>
        <span className="text-subhead text-grey tabular-nums">Cierra en {quedan} s</span>
      </div>
      <p className="text-headline">
        {solicitud.nombre} · {solicitud.titulo}
      </p>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {datos.map(([etiqueta, valor]) => (
          <div key={etiqueta} className="rounded-field bg-surface p-3">
            <dt className="text-caption text-grey">{etiqueta}</dt>
            <dd className="text-headline">{valor}</dd>
          </div>
        ))}
      </dl>
      <Button variant="secondary" className="w-full" onClick={() => conAviso(() => cerrarVotacion(solicitud.id))}>
        Cerrar votación ahora
      </Button>
    </Card>
  )
}
