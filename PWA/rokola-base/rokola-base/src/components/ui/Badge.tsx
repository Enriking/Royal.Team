import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'lava' | 'outline' | 'muted'

const variants: Record<Variant, string> = {
  lava: 'bg-lava text-jet',
  outline: 'border border-grey/60 text-offwhite',
  muted: 'bg-surface-2 text-grey',
}

/** Etiqueta tipo "label" del sistema de referencia. */
export function Badge({ variant = 'lava', className, ...props }: ComponentProps<'span'> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center rounded-lg px-3 text-caption font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
