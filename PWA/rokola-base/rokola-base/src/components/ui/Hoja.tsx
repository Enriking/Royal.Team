import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  abierta: boolean
  alCerrar: () => void
  titulo: string
  children: ReactNode
  className?: string
}

/**
 * Ventana modal: sube desde abajo en celular y se centra en pantallas grandes.
 * Usa <dialog> nativo (atrapa el foco y cierra con Esc). El contenido se monta al abrir, así un formulario empieza limpio.
 */
export function Hoja({ abierta, alCerrar, titulo, children, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (abierta && !dialogo.open) dialogo.showModal()
    if (!abierta && dialogo.open) dialogo.close()
  }, [abierta])

  return (
    // Con teclado se cierra con Esc (nativo de <dialog>); el clic es solo para tocar el fondo oscuro.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      aria-label={titulo}
      onClose={alCerrar}
      // Tocar el fondo oscuro (fuera del contenido) cierra
      onClick={(e) => e.target === e.currentTarget && alCerrar()}
      className={cn(
        'mx-auto mt-auto mb-0 max-h-[92dvh] w-full max-w-md rounded-t-card bg-midnight p-0 text-offwhite',
        'backdrop:bg-jet/75 backdrop:backdrop-blur-sm open:animate-subir sm:mb-auto sm:rounded-card',
        className,
      )}
    >
      {abierta && (
        <div className="space-y-4 p-5 pb-[max(env(safe-area-inset-bottom),20px)]">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-title-2">{titulo}</h2>
            <button
              type="button"
              onClick={alCerrar}
              aria-label="Cerrar"
              className="-m-2 rounded-full p-2 text-grey hover:text-offwhite"
            >
              <X className="size-6" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
