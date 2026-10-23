import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useFila } from '@/features/cola'
import { cn } from '@/lib/cn'
import type { Solicitud } from '@/lib/datos'

/**
 * Los próximos turnos (la persona llamada y la fila), con iniciales y canción.
 * Si el espacio no alcanza para todos, la lista se desvanece abajo en vez de desbordar la pantalla.
 */
export function ProximosTurnos({ limite = 5, className }: { limite?: number; className?: string }) {
  const { llamada, enEspera } = useFila()
  const lista = [llamada, ...enEspera].filter((s): s is Solicitud => s !== null).slice(0, limite)
  const total = enEspera.length + (llamada ? 1 : 0)
  const listaRef = useRef<HTMLOListElement>(null)
  const [desborda, setDesborda] = useState(false)

  useEffect(() => {
    const ol = listaRef.current
    if (!ol) return
    const medir = () => setDesborda(ol.scrollHeight > ol.clientHeight + 1)
    const observador = new ResizeObserver(medir)
    observador.observe(ol)
    medir()
    return () => observador.disconnect()
  }, [lista.length])

  return (
    <section className={cn('flex min-h-0 flex-col gap-3', className)}>
      <div className="flex shrink-0 items-baseline justify-between">
        <h2 className="text-headline tracking-[0.25em] text-grey uppercase">Siguen</h2>
        {total > limite && <span className="text-headline text-grey">+{total - limite} más</span>}
      </div>
      {lista.length === 0 ? (
        <p className="rounded-card border border-dashed border-line p-6 text-title-2 text-grey">La fila está vacía</p>
      ) : (
        <ol ref={listaRef} className={cn('min-h-0 space-y-2 overflow-hidden', desborda && 'mask-b-from-80%')}>
          {lista.map((s, i) => (
            <motion.li
              key={s.id}
              layout
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'flex items-center gap-4 rounded-card px-5 py-4',
                i === 0 ? 'border-2 border-lava' : 'bg-surface',
              )}
            >
              <span className="font-mono text-title-1 font-bold tracking-[0.15em] text-lava">{s.iniciales}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-title-2">{s.titulo}</span>
                <span className="block truncate text-headline font-normal text-grey">
                  {s.nombre} · Mesa {s.mesa}
                </span>
              </span>
              <span className="text-title-1 text-grey tabular-nums">{i + 1}</span>
            </motion.li>
          ))}
        </ol>
      )}
    </section>
  )
}
