import { motion } from 'motion/react'
import { conAviso } from '@/components/ui'
import type { Solicitud } from '@/lib/datos'
import { reaccionar } from '../api'
import { EMOJIS } from '../puntaje'
import { useReaccionesRestantes } from '../useVotacion'

/** Botones de emojis para reaccionar en vivo (salen flotando en la pantalla del bar). */
export function BarraReacciones({ solicitud }: { solicitud: Solicitud }) {
  const restantes = useReaccionesRestantes(solicitud.id)
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-1">
        {EMOJIS.map((emoji) => (
          <motion.button
            key={emoji}
            type="button"
            whileTap={{ scale: 1.35 }}
            disabled={restantes === 0}
            aria-label={`Reaccionar con ${emoji}`}
            onClick={() => conAviso(() => reaccionar(solicitud, emoji))}
            className="grid size-12 place-items-center rounded-full bg-jet/40 text-2xl disabled:opacity-35"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
      <p className="text-center text-caption text-offwhite/60">
        {restantes === 0
          ? 'Ya usaste todas tus reacciones'
          : restantes === 1
            ? 'Te queda 1 reacción'
            : `Te quedan ${restantes} reacciones`}
      </p>
    </div>
  )
}
