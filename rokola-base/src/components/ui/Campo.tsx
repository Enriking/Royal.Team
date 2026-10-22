import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Etiqueta + control + ayuda o error. El control va como hijo (Input, AreaTexto, select…). */
export function Campo({
  etiqueta,
  ayuda,
  error,
  className,
  children,
}: {
  etiqueta: string
  ayuda?: ReactNode
  error?: string | null
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn('block space-y-1.5', className)}>
      <span className="block text-subhead font-medium text-grey">{etiqueta}</span>
      {children}
      {error ? (
        <span className="block text-caption text-danger">{error}</span>
      ) : (
        ayuda && <span className="block text-caption text-grey">{ayuda}</span>
      )}
    </label>
  )
}

export function AreaTexto({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      rows={3}
      className={cn(
        'w-full resize-none rounded-field bg-surface-2 px-4 py-3 text-body text-offwhite outline-none placeholder:text-grey focus:ring-2 focus:ring-lava',
        className,
      )}
      {...props}
    />
  )
}
