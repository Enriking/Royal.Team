import { cn } from '@/lib/cn'

type Props = {
  activo: boolean
  alCambiar: (activo: boolean) => void
  etiqueta: string
  detalle?: string
  className?: string
}

/** Interruptor de sí/no con su etiqueta (toda la fila es tocable). */
export function Interruptor({ activo, alCambiar, etiqueta, detalle, className }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      onClick={() => alCambiar(!activo)}
      className={cn('flex w-full items-center justify-between gap-4 text-left', className)}
    >
      <span>
        <span className="block text-body">{etiqueta}</span>
        {detalle && <span className="block text-caption text-grey">{detalle}</span>}
      </span>
      <span className={cn('relative h-7 w-12 shrink-0 rounded-pill transition-colors', activo ? 'bg-lava' : 'bg-line')}>
        <span
          className={cn(
            'absolute top-1 left-1 size-5 rounded-full bg-offwhite transition-transform',
            activo && 'translate-x-5',
          )}
        />
      </span>
    </button>
  )
}
