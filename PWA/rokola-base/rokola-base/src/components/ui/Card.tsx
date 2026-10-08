import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'default' | 'outline' | 'lava' | 'gradient'

const variants: Record<Variant, string> = {
  default: 'bg-surface shadow-card',
  outline: 'border-2 border-lava bg-transparent',
  lava: 'bg-lava text-jet',
  gradient: 'bg-gradient-black-grey',
}

export function Card({ variant = 'default', className, ...props }: ComponentProps<'div'> & { variant?: Variant }) {
  return <div className={cn('rounded-card p-5', variants[variant], className)} {...props} />
}
