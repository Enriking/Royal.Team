import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import type { Solicitud } from '@/lib/datos'
import { nivelDe } from '../puntaje'

const formato = (valor: number | null, sufijo = '') => (valor === null ? '—' : `${valor}${sufijo}`)

/** Puntaje final con su nivel y el desglose (aplausos, calificación, energía). */
export function ResultadoVotacion({ solicitud, grande = false }: { solicitud: Solicitud; grande?: boolean }) {
  if (solicitud.puntaje === null) {
    return <p className="text-center text-subhead text-grey">Nadie votó esta vez.</p>
  }
  const nivel = nivelDe(solicitud.puntaje)
  const desglose = [
    ['Aplausos', formato(solicitud.aplausos)],
    ['Calificación', formato(solicitud.calificacion, ' / 3')],
    ['Energía', formato(solicitud.energia)],
  ]

  return (
    <div className="space-y-4 text-center">
      <motion.p
        initial={{ scale: 0.4, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className={cn('font-extrabold tracking-tight text-lava', grande ? 'text-[6rem] leading-none' : 'text-title-1')}
      >
        {nivel.texto}
      </motion.p>
      <p className={grande ? 'text-[3.5rem] leading-none font-bold' : 'text-title-2'}>
        {solicitud.puntaje} <span className="text-grey">pts</span>
      </p>
      <dl className="grid grid-cols-3 gap-2">
        {desglose.map(([etiqueta, valor]) => (
          <div key={etiqueta} className="rounded-field bg-jet/40 p-2">
            <dt className={cn('text-grey', grande ? 'text-subhead' : 'text-caption')}>{etiqueta}</dt>
            <dd className={grande ? 'text-title-2' : 'text-headline'}>{valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
