import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useReacciones } from '../useVotacion'

type Flotante = { id: string; emoji: string; x: number }

/**
 * Las reacciones nuevas suben flotando sobre su contenedor (que debe ser `relative`).
 * Conviene montarlo con `key={solicitudId}` para empezar limpio con cada canción.
 */
export function EmojisFlotantes({ solicitudId }: { solicitudId: string }) {
  const reacciones = useReacciones(solicitudId)
  const vistas = useRef<Set<string> | null>(null)
  const [flotantes, setFlotantes] = useState<Flotante[]>([])

  useEffect(() => {
    // Las que ya estaban al abrir no se animan
    if (!vistas.current) {
      vistas.current = new Set(reacciones.map((r) => r.id))
      return
    }
    const nuevas = reacciones.filter((r) => !vistas.current!.has(r.id))
    if (nuevas.length === 0) return
    nuevas.forEach((r) => vistas.current!.add(r.id))
    setFlotantes((actuales) =>
      [...actuales, ...nuevas.map((r) => ({ id: r.id, emoji: r.emoji, x: 8 + Math.random() * 84 }))].slice(-40),
    )
  }, [reacciones])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {flotantes.map((f) => (
          <motion.span
            key={f.id}
            className="absolute text-5xl"
            style={{ left: `${f.x}%` }}
            initial={{ top: '100%', opacity: 0, scale: 0.6 }}
            animate={{ top: '-15%', opacity: [0, 1, 1, 0], scale: 1.1, x: [0, -14, 14, 0] }}
            transition={{ duration: 3, ease: 'easeOut' }}
            onAnimationComplete={() => setFlotantes((actuales) => actuales.filter((a) => a.id !== f.id))}
          >
            {f.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
