import { ChevronDown, ChevronUp, ListOrdered, Megaphone, Play, SkipForward, Square, Users, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge, Button, Card, conAviso, Vacio } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { Solicitud } from '@/lib/datos'
import { cronometro } from '@/lib/tiempo'
import { useAhora } from '@/lib/useAhora'
import { empezar, llamar, mover, noSePresento, quitarDeFila, saltar, terminar } from '../api'
import { useFila } from '../useCola'

function Quien({ s }: { s: Solicitud }) {
  return (
    <p className="text-subhead text-grey">
      <span className="font-semibold text-offwhite">{s.nombre}</span> ({s.iniciales}) · Mesa {s.mesa}
      {s.dueto_con && ` · con ${s.dueto_con}`}
    </p>
  )
}

/** Escenario del DJ: quién canta, a quién se llamó y los botones para avanzar. */
export function EscenarioDj() {
  const { cantando, llamada, enEspera } = useFila()
  const ahora = useAhora()
  const siguiente = enEspera[0]

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {cantando ? (
        <Card className="space-y-4 bg-gradient-black-orange">
          <div className="flex items-center justify-between">
            <Badge>Cantando</Badge>
            <span className="font-mono text-headline tabular-nums">
              {cronometro(ahora - new Date(cantando.inicio_en ?? ahora).getTime())}
            </span>
          </div>
          <div>
            <p className="text-title-2">{cantando.titulo}</p>
            <p className="text-subhead text-offwhite/70">{cantando.artista}</p>
          </div>
          <Quien s={cantando} />
          <Button className="w-full" onClick={() => conAviso(() => terminar(cantando.id))}>
            <Square className="size-4 fill-current" /> Terminó: abrir votación
          </Button>
        </Card>
      ) : (
        <Card variant="gradient" className="grid place-items-center gap-3 py-8 text-center">
          <p className="text-title-2">Escenario libre</p>
          {!llamada && siguiente && (
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => conAviso(() => llamar(siguiente.id))}>
                <Megaphone className="size-4" /> Llamar a {siguiente.nombre}
              </Button>
              <Button variant="secondary" onClick={() => conAviso(() => empezar(siguiente.id))}>
                <Play className="size-4" /> Empezar ya
              </Button>
            </div>
          )}
          {!llamada && !siguiente && <p className="text-subhead text-grey">No hay nadie en la fila.</p>}
        </Card>
      )}

      {llamada && (
        <Card variant="outline" className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">Llamada</Badge>
            <span className="text-caption text-grey">
              esperando {cronometro(ahora - new Date(llamada.llamada_en ?? ahora).getTime())}
            </span>
          </div>
          <div>
            <p className="text-title-2">{llamada.titulo}</p>
            <p className="text-subhead text-grey">{llamada.artista}</p>
          </div>
          <Quien s={llamada} />
          <div className="flex flex-wrap gap-2">
            <Button className="flex-1" disabled={!!cantando} onClick={() => conAviso(() => empezar(llamada.id))}>
              <Play className="size-4" /> Empezar
            </Button>
            <Button variant="secondary" onClick={() => conAviso(() => saltar(llamada.id), 'Pasó al final de su ronda')}>
              <SkipForward className="size-4" /> Saltar
            </Button>
            <Button variant="ghost" onClick={() => conAviso(() => noSePresento(llamada.id))}>
              No vino
            </Button>
          </div>
          {cantando && <p className="text-caption text-grey">Podrás empezar cuando termine {cantando.nombre}.</p>}
        </Card>
      )}

      {cantando && !llamada && siguiente && (
        <Card className="flex flex-col justify-center gap-3">
          <p className="text-subhead text-grey">Sigue</p>
          <p className="text-headline">
            {siguiente.nombre} · {siguiente.titulo}
          </p>
          <Button variant="outline" onClick={() => conAviso(() => llamar(siguiente.id))}>
            <Megaphone className="size-4" /> Llamar para que se prepare
          </Button>
        </Card>
      )}
    </div>
  )
}

/** Fila de espera por rondas, con subir/bajar, llamar y quitar. */
export function FilaDj() {
  const { enEspera, llamada } = useFila()

  if (enEspera.length === 0) {
    return (
      <Vacio icono={ListOrdered} titulo="La fila está vacía">
        <p>Las canciones aprobadas en la Bandeja aparecen aquí, ordenadas por rondas.</p>
      </Vacio>
    )
  }

  return (
    <ol className="space-y-2">
      {enEspera.map((s, i) => {
        const nuevaRonda = i === 0 || enEspera[i - 1].ronda !== s.ronda
        return (
          <li key={s.id} className="space-y-2">
            {nuevaRonda && (
              <p className="pt-2 text-caption font-semibold tracking-[0.2em] text-grey uppercase">Ronda {s.ronda}</p>
            )}
            <Card className="flex items-center gap-3 p-3 sm:gap-4">
              <span className="w-7 text-center text-title-2 text-lava tabular-nums">{i + 1 + (llamada ? 1 : 0)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-headline">
                  <span className="font-bold text-lava">{s.iniciales}</span> · {s.titulo}
                </p>
                <p className="truncate text-subhead text-grey">
                  {s.nombre} · Mesa {s.mesa} · {s.artista || 'sin artista'}
                  {s.dueto_con && (
                    <>
                      {' '}
                      · <Users className="inline size-3.5" /> {s.dueto_con}
                    </>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center">
                <BotonIcono etiqueta="Subir" disabled={i === 0} onClick={() => conAviso(() => mover(s.id, 'subir'))}>
                  <ChevronUp />
                </BotonIcono>
                <BotonIcono
                  etiqueta="Bajar"
                  disabled={i === enEspera.length - 1}
                  onClick={() => conAviso(() => mover(s.id, 'bajar'))}
                >
                  <ChevronDown />
                </BotonIcono>
                <BotonIcono
                  etiqueta={`Llamar a ${s.nombre}`}
                  disabled={!!llamada}
                  onClick={() => conAviso(() => llamar(s.id))}
                >
                  <Megaphone />
                </BotonIcono>
                <BotonIcono
                  etiqueta="Quitar de la fila"
                  onClick={() => {
                    if (window.confirm(`¿Quitar “${s.titulo}” de ${s.nombre}?`)) void conAviso(() => quitarDeFila(s.id))
                  }}
                >
                  <X />
                </BotonIcono>
              </div>
            </Card>
          </li>
        )
      })}
    </ol>
  )
}

function BotonIcono({
  etiqueta,
  onClick,
  disabled,
  children,
}: {
  etiqueta: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      title={etiqueta}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'grid size-10 place-items-center rounded-full text-grey hover:bg-surface-2 hover:text-offwhite [&>svg]:size-5',
        'disabled:pointer-events-none disabled:opacity-30',
      )}
    >
      {children}
    </button>
  )
}
