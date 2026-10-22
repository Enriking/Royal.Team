import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { NIVELES, nivelDe } from '../puntaje'

/** Barra 0–100 con las marcas de nivel (¡BIEN!, ¡FUEGO!, ¡OVACIÓN!, ¡LEYENDA!). */
export function Medidor({ valor, grande = false, className }: { valor: number; grande?: boolean; className?: string }) {
  const actual = nivelDe(valor)
  return (
    <div className={cn('space-y-2', className)}>
      <meter className="sr-only" min={0} max={100} value={valor} aria-label="Aplausómetro" />
      <div
        className={cn('relative overflow-hidden rounded-pill bg-surface-2', grande ? 'h-10' : 'h-5')}
        aria-hidden="true"
      >
        <motion.div
          className="h-full rounded-pill bg-lava"
          animate={{ width: `${valor}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        />
        {NIVELES.filter((n) => n.desde > 0).map((n) => (
          <span key={n.texto} className="absolute inset-y-0 w-0.5 bg-jet/70" style={{ left: `${n.desde}%` }} />
        ))}
      </div>
      <div className={cn('flex font-bold whitespace-nowrap', grande ? 'text-headline' : 'text-caption')}>
        {[...NIVELES].reverse().map((n, i, lista) => (
          <span
            key={n.texto}
            className={cn('overflow-hidden pl-1', n === actual ? 'text-lava' : 'text-grey-strong')}
            style={{ width: `${(lista[i + 1]?.desde ?? 100) - n.desde}%` }}
          >
            {n.texto}
          </span>
        ))}
      </div>
    </div>
  )
}
