import { Mic, Users } from 'lucide-react'
import { Button, Card, conAviso } from '@/components/ui'
import { cancelarSolicitud } from '../api'
import type { MiSolicitud } from '../useCola'
import { EstadoBadge } from './EstadoBadge'

function Cancion({ s, claro = false }: { s: MiSolicitud; claro?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-headline">{s.titulo}</p>
      <p className={claro ? 'truncate text-subhead text-jet/70' : 'truncate text-subhead text-grey'}>
        {s.artista || 'Artista desconocido'} · {s.nombre}
        {s.dueto_con && ` y ${s.dueto_con}`}
      </p>
    </div>
  )
}

function Cancelar({ s }: { s: MiSolicitud }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-mr-2"
      onClick={() => {
        if (window.confirm(`¿Cancelar “${s.titulo}”? Perderás tu lugar en la fila.`)) {
          void conAviso(() => cancelarSolicitud(s.id), 'Canción cancelada')
        }
      }}
    >
      Cancelar
    </Button>
  )
}

/** Tarjeta grande de una canción activa del cliente, según su estado. */
export function TarjetaMiSolicitud({ s }: { s: MiSolicitud }) {
  switch (s.estado) {
    case 'llamada':
      return (
        <Card variant="lava" className="space-y-3">
          <p className="flex items-center gap-2 text-title-2">
            <Mic className="size-7" /> ¡Te toca! Pasa al escenario
          </p>
          <Cancion s={s} claro />
        </Card>
      )
    case 'cantando':
      return (
        <Card className="space-y-3 bg-gradient-black-orange">
          <p className="text-title-2">Estás cantando 🎤</p>
          <Cancion s={s} />
        </Card>
      )
    case 'valorando':
      return (
        <Card variant="gradient" className="space-y-3">
          <p className="text-title-2">¡Bien hecho! El público te está calificando…</p>
          <Cancion s={s} />
        </Card>
      )
    case 'aprobada':
      return (
        <Card variant="outline" className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-subhead font-semibold text-grey">Tu lugar en la fila</p>
              <p className="text-caption text-grey">
                {s.minutos === 0 ? 'Prepárate' : `≈ ${s.minutos} min`} · Ronda {s.ronda}
              </p>
            </div>
            <span className="text-large-title text-lava">{(s.turnos ?? 0) + 1}</span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <Cancion s={s} />
            <Cancelar s={s} />
          </div>
        </Card>
      )
    case 'en_revision':
      return (
        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <EstadoBadge estado={s.estado} />
            <span className="text-caption text-grey">El DJ la está revisando</span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <Cancion s={s} />
            <Cancelar s={s} />
          </div>
        </Card>
      )
    default:
      return <FilaHistorial s={s} />
  }
}

/** Renglón compacto para canciones ya cantadas, rechazadas o canceladas. */
export function FilaHistorial({ s }: { s: MiSolicitud }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate text-body">{s.titulo}</p>
        <p className="truncate text-caption text-grey">
          {s.estado === 'terminada' && s.puntaje !== null
            ? `${s.nombre} · ${s.puntaje} puntos`
            : s.motivo_rechazo
              ? s.motivo_rechazo
              : s.nombre}
        </p>
      </div>
      <span className="flex shrink-0 items-center gap-2">
        {s.dueto_con && <Users className="size-4 text-grey" aria-label="Dueto" />}
        <EstadoBadge estado={s.estado} />
      </span>
    </div>
  )
}
