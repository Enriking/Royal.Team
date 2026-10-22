import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Estado vacío: cuando una lista todavía no tiene nada. */
export function Vacio({
  icono: Icono,
  titulo,
  children,
  className,
}: {
  icono: LucideIcon
  titulo: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-card border border-dashed border-line px-6 py-10 text-center',
        className,
      )}
    >
      <Icono className="size-8 text-grey" />
      <p className="text-headline">{titulo}</p>
      {children && <div className="space-y-3 text-subhead text-grey">{children}</div>}
    </div>
  )
}
