import { cn } from '@/lib/cn'

const ISO_PATH =
  'M10 58 V31 A22 22 0 0 1 54 31 V58 Z M38 25 A6 6 0 1 1 26 25 A6 6 0 1 1 38 25 Z ' +
  'M16 58 V45 A3 3 0 0 1 22 45 V58 Z M29 58 V40 A3 3 0 0 1 35 40 V58 Z M42 58 V49 A3 3 0 0 1 48 49 V58 Z'

const sizes = {
  sm: { mark: 'h-6', text: 'text-xl' },
  md: { mark: 'h-8', text: 'text-[1.7rem]' },
  lg: { mark: 'h-14', text: 'text-5xl' },
}

/** Isotipo provisional: arco de rocola + disco + barras de la fila. */
export function LogoMark({ className, color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d={ISO_PATH} fill={color} fillRule="evenodd" />
    </svg>
  )
}

/** Logo horizontal: isotipo naranja + "rokola". */
export function Logo({ className, size = 'md' }: { className?: string; size?: keyof typeof sizes }) {
  const s = sizes[size]
  return (
    <span className={cn('inline-flex items-center gap-2 leading-none font-extrabold tracking-[-0.04em]', className)}>
      <LogoMark className={cn(s.mark, 'w-auto text-lava')} />
      <span className={s.text}>rokola</span>
    </span>
  )
}
