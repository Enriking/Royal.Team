import { Music } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  titulo: string
  artista: string
  detalle?: ReactNode
  /** Botones o etiquetas a la derecha. */
  derecha?: ReactNode
  /** Si se pasa, toda la fila es un botón. */
  onClick?: () => void
  className?: string
}

/** Fila de una canción: icono, título y artista. */
export function CancionItem({ titulo, artista, detalle, derecha, onClick, className }: Props) {
  const contenido = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-field bg-surface-2 text-lava">
        <Music className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-headline">{titulo}</span>
        <span className="block truncate text-subhead text-grey">
          {artista || 'Artista desconocido'}
          {detalle && <> · {detalle}</>}
        </span>
      </span>
    </>
  )
  const clases = cn('flex w-full items-center gap-3 rounded-field px-2 py-2 text-left', className)

  if (onClick) {
    return (
      <div className="flex items-center gap-2">
        <button type="button" onClick={onClick} className={cn(clases, 'hover:bg-surface active:bg-surface-2')}>
          {contenido}
        </button>
        {derecha}
      </div>
    )
  }
  return (
    <div className={clases}>
      {contenido}
      {derecha && <span className="flex shrink-0 items-center gap-1">{derecha}</span>}
    </div>
  )
}
