import type { ComponentProps } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'
type StyleProps = { variant?: Variant; size?: Size }

const variants: Record<Variant, string> = {
  primary: 'bg-lava text-jet hover:bg-lava-hover active:bg-lava-press',
  secondary: 'bg-surface-2 text-offwhite hover:bg-line',
  outline: 'border border-lava text-lava hover:bg-lava-soft',
  ghost: 'text-grey hover:text-offwhite hover:bg-surface',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-subhead',
  md: 'h-12 px-5 text-body',
  lg: 'h-14 px-6 text-headline',
}

function buttonClass({ variant = 'primary', size = 'md' }: StyleProps, className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-field font-semibold transition-colors',
    'disabled:pointer-events-none disabled:bg-grey-strong disabled:text-offwhite/60',
    variants[variant],
    sizes[size],
    className,
  )
}

/** Botón de acción. Por defecto es `type="button"` para no enviar formularios por accidente. */
export function Button({ variant, size, className, type = 'button', ...props }: ComponentProps<'button'> & StyleProps) {
  return <button type={type} className={buttonClass({ variant, size }, className)} {...props} />
}

/** Enlace con apariencia de botón (para navegar sin anidar un <button> dentro de un <a>). */
export function ButtonLink({ variant, size, className, ...props }: LinkProps & StyleProps) {
  return <Link className={buttonClass({ variant, size }, className)} {...props} />
}
