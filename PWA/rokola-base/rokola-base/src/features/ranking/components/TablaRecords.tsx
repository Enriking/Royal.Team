import { Trophy } from 'lucide-react'
import type { ReactNode } from 'react'
import { Vacio } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { Solicitud } from '@/lib/datos'

/** Tabla de récords estilo arcade: lugar, iniciales, canción y puntaje. */
export function TablaRecords({
  registros,
  vacio,
  grande = false,
}: {
  registros: Solicitud[]
  vacio?: ReactNode
  /** Tamaño para la pantalla del bar. */
  grande?: boolean
}) {
  if (registros.length === 0) {
    return (
      <Vacio icono={Trophy} titulo="Todavía no hay récords">
        {vacio}
      </Vacio>
    )
  }

  return (
    <ol className="space-y-2">
      {registros.map((s, i) => (
        <li
          key={s.id}
          className={cn(
            'flex items-center gap-4 rounded-card px-4',
            grande ? 'py-4' : 'py-3',
            i === 0 ? 'bg-lava text-jet' : 'bg-surface',
          )}
        >
          <span className={cn('w-7 text-center tabular-nums', grande ? 'text-title-1' : 'text-title-2')}>{i + 1}</span>
          <span className={cn('font-mono font-bold tracking-[0.2em]', grande ? 'text-title-1' : 'text-title-2')}>
            {s.iniciales}
          </span>
          <span className="min-w-0 flex-1">
            <span className={cn('block truncate', grande ? 'text-title-2' : 'text-headline')}>{s.titulo}</span>
            <span className={cn('block truncate text-caption', i === 0 ? 'text-jet/70' : 'text-grey')}>
              {s.nombre} · Mesa {s.mesa}
            </span>
          </span>
          <span className={cn('font-bold tabular-nums', grande ? 'text-title-1' : 'text-title-2')}>{s.puntaje}</span>
        </li>
      ))}
    </ol>
  )
}
