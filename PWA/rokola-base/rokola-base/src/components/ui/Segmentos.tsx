import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type Opcion<T extends string> = { valor: T; texto: string; icono?: LucideIcon }

/** Selector de opciones excluyentes (pestañas pequeñas): "Esta noche · Semana · Mes". */
export function Segmentos<T extends string>({
  opciones,
  valor,
  alCambiar,
  className,
}: {
  opciones: Opcion<T>[]
  valor: T
  alCambiar: (valor: T) => void
  className?: string
}) {
  return (
    <div
      className={cn('grid gap-1 rounded-field bg-surface p-1', className)}
      style={{ gridTemplateColumns: `repeat(${opciones.length}, minmax(0, 1fr))` }}
    >
      {opciones.map(({ valor: v, texto, icono: Icono }) => (
        <button
          key={v}
          type="button"
          aria-pressed={valor === v}
          onClick={() => alCambiar(v)}
          className={cn(
            'flex h-10 items-center justify-center gap-2 rounded-[0.625rem] px-2 text-subhead font-semibold transition-colors',
            valor === v ? 'bg-surface-2 text-offwhite' : 'text-grey hover:text-offwhite',
          )}
        >
          {Icono && <Icono className="size-4" />}
          {texto}
        </button>
      ))}
    </div>
  )
}
