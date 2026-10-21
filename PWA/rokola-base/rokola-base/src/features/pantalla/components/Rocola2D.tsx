import { motion, useReducedMotion } from 'motion/react'
import { LogoMark } from '@/components/ui'
import { cn } from '@/lib/cn'

const BARRAS = [0.9, 0.6, 1, 0.75, 0.5, 0.85, 0.65]

/** Rocola 2D: disco de vinil que gira y ecualizador que baila mientras alguien canta. (La versión 3D llegará después.) */
export function Rocola2D({ girando, className }: { girando: boolean; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-8', className)} aria-hidden="true">
      <div
        className={cn(
          'relative aspect-square w-full rounded-full shadow-glow motion-reduce:animate-none',
          girando && 'animate-girar-lento',
        )}
        style={{ background: 'repeating-radial-gradient(circle at center, #1c1b1d 0 2px, #0b0b0c 2px 6px)' }}
      >
        <div className="absolute inset-[30%] grid place-items-center rounded-full bg-lava">
          <LogoMark className="size-1/2 text-jet" />
        </div>
      </div>
      <Ecualizador activo={girando} />
    </div>
  )
}

function Ecualizador({ activo }: { activo: boolean }) {
  const reducido = useReducedMotion()
  return (
    <div className="flex h-16 items-end gap-2">
      {BARRAS.map((altura, i) => (
        <motion.span
          key={i}
          className="w-3 rounded-pill bg-lava"
          initial={{ height: '15%' }}
          animate={
            activo && !reducido
              ? { height: ['20%', `${altura * 100}%`, '35%', `${altura * 80}%`, '20%'] }
              : { height: '15%' }
          }
          transition={activo && !reducido ? { duration: 0.9 + i * 0.13, repeat: Infinity, ease: 'easeInOut' } : {}}
        />
      ))}
    </div>
  )
}
