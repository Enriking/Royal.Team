import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'dark' | 'lava' | 'grey'

const variants: Record<Variant, string> = {
  dark: 'bg-surface-2 text-offwhite placeholder:text-grey focus:ring-lava',
  lava: 'bg-lava text-jet placeholder:text-jet/70 focus:ring-offwhite',
  grey: 'bg-grey-strong text-offwhite placeholder:text-offwhite/70 focus:ring-lava',
}

export function Input({ variant = 'dark', className, ...props }: ComponentProps<'input'> & { variant?: Variant }) {
  return (
    <input
      className={cn('h-12 w-full rounded-field px-4 text-body outline-none focus:ring-2', variants[variant], className)}
      {...props}
    />
  )
}
