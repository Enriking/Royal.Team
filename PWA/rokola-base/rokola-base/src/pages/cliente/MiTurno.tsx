import { Mic, X } from 'lucide-react'
import { ButtonLink, Vacio } from '@/components/ui'
import { FilaHistorial, quitarPerfil, TarjetaMiSolicitud, useMisSolicitudes, usePerfiles } from '@/features/cola'

const ACTIVAS = new Set(['en_revision', 'aprobada', 'llamada', 'cantando', 'valorando'])

export default function MiTurno() {
  const mias = useMisSolicitudes()
  const perfiles = usePerfiles()
  const activas = mias.filter((s) => ACTIVAS.has(s.estado)).sort((a, b) => (a.turnos ?? -1) - (b.turnos ?? -1))
  const historial = mias.filter((s) => !ACTIVAS.has(s.estado))

  return (
    <>
      <h1 className="pt-2 text-title-1">Mi turno</h1>

      {activas.length === 0 ? (
        <Vacio icono={Mic} titulo="No tienes canciones en la fila">
          <p>Pide una y aquí verás tu lugar y cuánto falta.</p>
          <ButtonLink to="/m/buscar">Pedir canción</ButtonLink>
        </Vacio>
      ) : (
        activas.map((s) => <TarjetaMiSolicitud key={s.id} s={s} />)
      )}

      {historial.length > 0 && (
        <section className="pt-2">
          <h2 className="text-headline text-grey">Esta noche</h2>
          <div className="divide-y divide-line/60">
            {historial.map((s) => (
              <FilaHistorial key={s.id} s={s} />
            ))}
          </div>
        </section>
      )}

      {perfiles.length > 0 && (
        <section className="space-y-2 pt-2">
          <h2 className="text-headline text-grey">Quién canta desde este celular</h2>
          <div className="flex flex-wrap gap-2">
            {perfiles.map((p) => (
              <span
                key={p.id}
                className="inline-flex h-9 items-center gap-2 rounded-pill bg-surface pr-1 pl-4 text-subhead"
              >
                <span className="font-bold text-lava">{p.iniciales}</span> {p.nombre}
                <button
                  type="button"
                  aria-label={`Quitar a ${p.nombre}`}
                  onClick={() => quitarPerfil(p.id)}
                  className="grid size-7 place-items-center rounded-full text-grey hover:bg-surface-2 hover:text-offwhite"
                >
                  <X className="size-4" />
                </button>
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
