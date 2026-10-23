import { Maximize, Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SENSIBILIDADES, type Sensibilidad } from '@/features/votacion'
import type { useAplausometroPantalla } from '../useAplausometroPantalla'

type Props = ReturnType<typeof useAplausometroPantalla>

/** Controles discretos (se ven al pasar el mouse): micrófono, sensibilidad y pantalla completa. */
export function ControlesPantalla({ micro, sensibilidad, cambiarSensibilidad }: Props) {
  const activo = micro.estado === 'activo'
  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 rounded-field bg-midnight/90 p-2 text-subhead transition-opacity',
        activo ? 'opacity-0 focus-within:opacity-100 hover:opacity-100' : 'opacity-90',
      )}
    >
      <button
        type="button"
        onClick={activo ? micro.detener : micro.iniciar}
        className={cn(
          'flex h-9 items-center gap-2 rounded-[0.625rem] px-3 font-semibold',
          activo ? 'bg-surface-2' : 'bg-lava text-jet',
        )}
      >
        {activo ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        {activo
          ? `Aplausómetro: ${micro.nivel}`
          : micro.estado === 'pidiendo'
            ? 'Pidiendo permiso…'
            : 'Activar aplausómetro'}
      </button>
      {activo &&
        (Object.keys(SENSIBILIDADES) as Sensibilidad[]).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={sensibilidad === s}
            onClick={() => cambiarSensibilidad(s)}
            className={cn(
              'h-9 rounded-[0.625rem] px-3',
              sensibilidad === s ? 'bg-surface-2 text-offwhite' : 'text-grey',
            )}
          >
            {s}
          </button>
        ))}
      <button
        type="button"
        aria-label="Pantalla completa"
        title="Pantalla completa"
        onClick={() =>
          document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
        }
        className="grid size-9 place-items-center rounded-[0.625rem] text-grey hover:text-offwhite"
      >
        <Maximize className="size-4" />
      </button>
      {micro.error && <p className="w-full max-w-xs px-1 text-caption text-danger">{micro.error}</p>}
    </div>
  )
}
