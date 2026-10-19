import { Inbox, MessageSquare, TriangleAlert, Trophy, Users } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, Card, conAviso, Hoja, Input, Interruptor, Vacio } from '@/components/ui'
import { guardarAjustes, useAjustes, type Solicitud } from '@/lib/datos'
import { haceCuanto } from '@/lib/tiempo'
import { useAhora } from '@/lib/useAhora'
import { aprobar, rechazar } from '../api'
import { mismaCancionHoy, rondaPrevista } from '../reglas'
import { useFila, useSolicitudesNoche } from '../useCola'

const MOTIVOS = ['No la tenemos', 'Ya se cantó esta noche', 'No va con el ambiente', 'Ya vamos a cerrar']

/** Bandeja del DJ: solicitudes nuevas en tiempo real para aprobar o rechazar. */
export function BandejaDj() {
  const noche = useSolicitudesNoche()
  const { enRevision } = useFila()
  const ajustes = useAjustes()
  const [rechazando, setRechazando] = useState<Solicitud | null>(null)

  async function aprobarTodas() {
    for (const s of enRevision) await conAviso(() => aprobar(s.id))
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-title-1">Bandeja</h1>
          {enRevision.length > 0 && <Badge>{enRevision.length} nuevas</Badge>}
        </div>
        {enRevision.length > 1 && (
          <Button size="sm" variant="outline" onClick={aprobarTodas}>
            Aprobar todas
          </Button>
        )}
      </div>

      <Card className="py-4">
        <Interruptor
          etiqueta="Recibiendo canciones"
          detalle={ajustes.aceptando ? 'Las mesas pueden pedir' : 'Las mesas ven que la fila está cerrada'}
          activo={ajustes.aceptando}
          alCambiar={(aceptando) => conAviso(() => guardarAjustes({ aceptando }))}
        />
      </Card>

      {enRevision.length === 0 ? (
        <Vacio icono={Inbox} titulo="Sin solicitudes nuevas">
          <p>Llegan aquí en tiempo real cuando alguien pide desde su mesa.</p>
        </Vacio>
      ) : (
        <div className="space-y-3">
          {enRevision.map((s) => (
            <TarjetaRevision key={s.id} s={s} noche={noche} alRechazar={() => setRechazando(s)} />
          ))}
        </div>
      )}

      <Hoja abierta={rechazando !== null} alCerrar={() => setRechazando(null)} titulo="¿Por qué no?">
        {rechazando && <FormularioRechazo s={rechazando} alTerminar={() => setRechazando(null)} />}
      </Hoja>
    </>
  )
}

function TarjetaRevision({ s, noche, alRechazar }: { s: Solicitud; noche: Solicitud[]; alRechazar: () => void }) {
  const ahora = useAhora(30_000)
  const ronda = rondaPrevista(noche, s)
  const repetidas = mismaCancionHoy(noche, s).length

  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-3">
        <div>
          <p className="text-headline">
            {s.titulo} <span className="font-normal text-grey">· {s.artista || 'sin artista'}</span>
            {!s.cancion_id && (
              <Badge variant="outline" className="ml-2 h-6 align-middle">
                Escrita
              </Badge>
            )}
          </p>
          <p className="text-subhead text-grey">
            <span className="font-semibold text-offwhite">{s.nombre}</span> ({s.iniciales}) · Mesa {s.mesa} ·{' '}
            {ronda === 1 ? 'Primera canción' : `Ronda ${ronda}`} · {haceCuanto(s.creada_en, ahora)}
          </p>
        </div>

        {(s.dueto_con || s.compite || s.nota || repetidas > 0) && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-subhead text-grey">
            {s.dueto_con && (
              <li className="flex items-center gap-1.5">
                <Users className="size-4" /> Dueto con {s.dueto_con}
              </li>
            )}
            {s.compite && (
              <li className="flex items-center gap-1.5">
                <Trophy className="size-4" /> Compite
              </li>
            )}
            {repetidas > 0 && (
              <li className="flex items-center gap-1.5 text-lava">
                <TriangleAlert className="size-4" /> Ya se pidió {repetidas === 1 ? 'otra vez' : `${repetidas} veces`}{' '}
                hoy
              </li>
            )}
            {s.nota && (
              <li className="flex w-full items-start gap-1.5 text-offwhite">
                <MessageSquare className="mt-0.5 size-4 shrink-0 text-grey" /> “{s.nota}”
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={alRechazar}>
          Rechazar
        </Button>
        <Button size="sm" onClick={() => conAviso(() => aprobar(s.id))}>
          Aprobar
        </Button>
      </div>
    </Card>
  )
}

function FormularioRechazo({ s, alTerminar }: { s: Solicitud; alTerminar: () => void }) {
  const [otro, setOtro] = useState('')
  const enviar = async (motivo: string) => {
    if (await conAviso(() => rechazar(s.id, motivo), 'Solicitud rechazada')) alTerminar()
  }

  return (
    <div className="space-y-3">
      <p className="text-subhead text-grey">
        “{s.titulo}” de {s.nombre} · Mesa {s.mesa}. El cliente verá el motivo.
      </p>
      <div className="grid gap-2">
        {MOTIVOS.map((m) => (
          <Button key={m} variant="secondary" className="justify-start" onClick={() => enviar(m)}>
            {m}
          </Button>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (otro.trim()) void enviar(otro)
        }}
      >
        <Input value={otro} onChange={(e) => setOtro(e.target.value)} placeholder="Otro motivo" maxLength={80} />
        <Button type="submit" disabled={!otro.trim()}>
          Enviar
        </Button>
      </form>
    </div>
  )
}
