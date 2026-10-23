import { CircleAlert, CircleCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/cn'
import { avisosStore } from './avisosStore'

/** Muestra los avisos de `avisar()` arriba de la pantalla. */
export function Avisos() {
  const avisos = useSyncExternalStore(avisosStore.suscribir, avisosStore.leer)
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-3 z-50 mx-auto flex max-w-md flex-col items-center gap-2 px-4"
    >
      <AnimatePresence initial={false}>
        {avisos.map((a) => (
          <motion.div
            key={a.id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={cn(
              'flex w-full items-center gap-3 rounded-field px-4 py-3 text-subhead font-medium shadow-card',
              a.tipo === 'error' ? 'bg-danger text-jet' : 'bg-surface-2 text-offwhite',
            )}
          >
            {a.tipo === 'error' ? (
              <CircleAlert className="size-5 shrink-0" />
            ) : (
              <CircleCheck className="size-5 shrink-0 text-success" />
            )}
            {a.texto}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
