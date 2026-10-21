import { conAviso } from '@/components/ui'
import { cn } from '@/lib/cn'
import { dispositivoId, useAjustes, type Solicitud } from '@/lib/datos'
import { useAhora } from '@/lib/useAhora'
import { calificar } from '../api'
import { CALIFICACIONES } from '../puntaje'
import { segundosRestantes, useMiCalificacion } from '../useVotacion'

/** Calificación del público al terminar una canción: Bien · Muy bien · ¡Increíble! */
export function Calificar({ solicitud }: { solicitud: Solicitud }) {
  const mia = useMiCalificacion(solicitud.id)
  const { segundos_votacion } = useAjustes()
  const ahora = useAhora()
  const quedan = segundosRestantes(solicitud, segundos_votacion, ahora)

  if (solicitud.dispositivo_id === dispositivoId()) {
    return <p className="text-subhead text-grey">Tu canción está en votación. ¡Bien hecho!</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-headline">¿Qué tal cantó {solicitud.nombre}?</p>
        <span className="text-caption text-grey tabular-nums">{quedan} s</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {CALIFICACIONES.map(({ valor, texto }) => (
          <button
            key={valor}
            type="button"
            aria-pressed={mia === valor}
            onClick={() => conAviso(() => calificar(solicitud, valor))}
            className={cn(
              'h-14 rounded-field text-subhead font-semibold transition-colors',
              mia === valor ? 'bg-lava text-jet' : 'bg-surface-2 text-offwhite hover:bg-line',
            )}
          >
            {texto}
          </button>
        ))}
      </div>
      {mia && <p className="text-caption text-grey">¡Gracias! Puedes cambiar tu voto mientras siga abierta.</p>}
    </div>
  )
}
