import { Mic } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, type ReactNode } from 'react'
import { Badge } from '@/components/ui'
import { useFila, useSolicitudesNoche } from '@/features/cola'
import { EmojisFlotantes, Medidor, ResultadoVotacion, segundosRestantes, useVotacionEnVivo } from '@/features/votacion'
import { useAjustes, type Solicitud } from '@/lib/datos'
import { useAhora } from '@/lib/useAhora'
import { Rocola2D } from './Rocola2D'

/** Segundos que se queda el puntaje en pantalla después de cerrar la votación. */
const SEGUNDOS_REVELACION = 15

/**
 * Zona principal de la TV. Muestra el momento de la noche:
 * votación → puntaje → quién canta → a quién se llamó → escenario libre.
 */
export function EscenarioPantalla({ nivelMicro }: { nivelMicro: number | null }) {
  const { cantando, valorando, llamada } = useFila()
  const noche = useSolicitudesNoche()
  const ahora = useAhora()

  const revelacion = useMemo(() => {
    const ultima = noche
      .filter((s) => s.estado === 'terminada' && s.cerrada_en)
      .sort((a, b) => b.cerrada_en!.localeCompare(a.cerrada_en!))[0]
    return ultima && ahora - new Date(ultima.cerrada_en!).getTime() < SEGUNDOS_REVELACION * 1000 ? ultima : null
  }, [noche, ahora])

  let clave: string
  let contenido: ReactNode
  if (valorando) {
    clave = `votando-${valorando.id}`
    contenido = <Votando s={valorando} nivelMicro={nivelMicro} />
  } else if (revelacion) {
    clave = `resultado-${revelacion.id}`
    contenido = <Revelacion s={revelacion} />
  } else if (cantando) {
    clave = `cantando-${cantando.id}`
    contenido = <Cantando s={cantando} />
  } else if (llamada) {
    clave = `llamada-${llamada.id}`
    contenido = <Llamando s={llamada} />
  } else {
    clave = 'libre'
    contenido = <Libre />
  }

  return (
    <section className="relative flex min-h-[60vh] overflow-hidden rounded-card bg-gradient-black-grey p-10 lg:min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={clave}
          className="flex w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35 }}
        >
          {contenido}
        </motion.div>
      </AnimatePresence>
      {cantando && <EmojisFlotantes key={cantando.id} solicitudId={cantando.id} />}
      {valorando && <EmojisFlotantes key={valorando.id} solicitudId={valorando.id} />}
    </section>
  )
}

function Quien({ s }: { s: Solicitud }) {
  return (
    <p className="text-title-2 text-offwhite/80">
      {s.nombre}
      {s.dueto_con && ` y ${s.dueto_con}`} · Mesa {s.mesa}
    </p>
  )
}

function Cantando({ s }: { s: Solicitud }) {
  return (
    <div className="grid w-full items-center gap-10 xl:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <Badge className="h-9 px-4 text-subhead">Cantando ahora</Badge>
        <div>
          <h1 className="text-[clamp(3rem,6vw,6rem)] leading-[0.95] font-extrabold tracking-tight">{s.titulo}</h1>
          <p className="mt-3 text-title-1 text-grey">{s.artista}</p>
        </div>
        <Quien s={s} />
        <p className="text-headline text-grey">Reacciona desde tu celular 🔥👏❤️</p>
      </div>
      <Rocola2D girando className="mx-auto w-full max-w-[20rem]" />
    </div>
  )
}

function Llamando({ s }: { s: Solicitud }) {
  return (
    <div className="m-auto space-y-6 text-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="mx-auto grid size-28 place-items-center rounded-full bg-lava text-jet"
      >
        <Mic className="size-14" />
      </motion.div>
      <p className="text-[clamp(2.5rem,5vw,5rem)] leading-none font-extrabold">¡{s.nombre}, pasa al escenario!</p>
      <p className="text-title-1 text-grey">
        {s.titulo} · {s.artista}
      </p>
    </div>
  )
}

function Votando({ s, nivelMicro }: { s: Solicitud; nivelMicro: number | null }) {
  const vivo = useVotacionEnVivo(s)
  const { segundos_votacion } = useAjustes()
  const ahora = useAhora()
  const valor = nivelMicro ?? vivo.puntaje ?? 0

  return (
    <div className="m-auto w-full max-w-4xl space-y-10 text-center">
      <div className="space-y-3">
        <p className="text-title-2 tracking-[0.2em] text-lava uppercase">¡A votar!</p>
        <p className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-extrabold">{s.nombre}</p>
        <p className="text-title-2 text-grey">{s.titulo}</p>
      </div>
      <div className="space-y-3 text-left">
        <p className="text-headline text-grey">{nivelMicro === null ? 'Energía del público' : '¡Aplaudan! 👏'}</p>
        <Medidor valor={valor} grande />
      </div>
      <div className="flex justify-center gap-10 text-title-2">
        <span>
          {vivo.votos} {vivo.votos === 1 ? 'voto' : 'votos'}
        </span>
        <span>
          {vivo.totalReacciones} {vivo.totalReacciones === 1 ? 'reacción' : 'reacciones'}
        </span>
        <span className="text-lava tabular-nums">{segundosRestantes(s, segundos_votacion, ahora)} s</span>
      </div>
      <p className="text-headline text-grey">Califica desde tu celular: Bien · Muy bien · ¡Increíble!</p>
    </div>
  )
}

function Revelacion({ s }: { s: Solicitud }) {
  return (
    <div className="m-auto w-full max-w-3xl space-y-6">
      <p className="text-center text-title-1">
        <span className="font-mono tracking-[0.2em] text-lava">{s.iniciales}</span> · {s.nombre}
      </p>
      <ResultadoVotacion solicitud={s} grande />
    </div>
  )
}

function Libre() {
  return (
    <div className="m-auto grid w-full max-w-4xl items-center gap-12 lg:grid-cols-[18rem_1fr]">
      <Rocola2D girando={false} className="mx-auto w-full max-w-[18rem]" />
      <div className="space-y-4 text-center lg:text-left">
        <p className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-extrabold">¿Quién se avienta la siguiente?</p>
        <p className="text-title-2 text-grey">Escanea el código, busca tu canción y pídela desde tu mesa.</p>
      </div>
    </div>
  )
}
