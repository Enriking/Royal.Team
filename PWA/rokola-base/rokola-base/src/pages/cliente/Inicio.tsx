import { ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Badge, Button, ButtonLink, Card } from '@/components/ui'
import { CancionItem, useListas, type Lista } from '@/features/catalogo'
import { HojaPedido, proximaMia, useFila, useMisSolicitudes, useSolicitudesNoche, type Pedido } from '@/features/cola'
import { BarraReacciones, Calificar, ResultadoVotacion } from '@/features/votacion'
import { useAjustes } from '@/lib/datos'
import { useAhora } from '@/lib/useAhora'

/** Un resultado se queda en Inicio estos minutos después de cerrar la votación. */
const MINUTOS_RESULTADO = 3

export default function Inicio() {
  const { cantando, valorando, llamada, enEspera } = useFila()
  const noche = useSolicitudesNoche()
  const proxima = proximaMia(useMisSolicitudes())
  const { aceptando } = useAjustes()
  const listas = useListas()
  const ahora = useAhora(15_000)
  const [pedido, setPedido] = useState<Pedido | null>(null)

  const siguiente = llamada ?? enEspera[0]
  const ultimoResultado = useMemo(() => {
    const ultima = noche
      .filter((s) => s.estado === 'terminada' && s.cerrada_en)
      .sort((a, b) => b.cerrada_en!.localeCompare(a.cerrada_en!))[0]
    const reciente = ultima && ahora - new Date(ultima.cerrada_en!).getTime() < MINUTOS_RESULTADO * 60_000
    return reciente ? ultima : null
  }, [noche, ahora])

  return (
    <>
      {!aceptando && (
        <Card className="border border-danger/40 text-subhead">
          El DJ cerró la fila por ahora. Puedes seguir votando y ver el ranking.
        </Card>
      )}

      {proxima && (
        <Link to="turno" className="block">
          <Card variant={proxima.estado === 'llamada' ? 'lava' : 'outline'} className="flex items-center gap-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-headline">
                {proxima.estado === 'llamada'
                  ? '¡Te toca! Pasa al escenario'
                  : proxima.estado === 'cantando'
                    ? 'Estás cantando'
                    : proxima.estado === 'en_revision'
                      ? 'Tu canción está en revisión'
                      : `Tu lugar: ${(proxima.turnos ?? 0) + 1} · ≈ ${proxima.minutos} min`}
              </p>
              <p className="truncate text-subhead opacity-70">{proxima.titulo}</p>
            </div>
            <ChevronRight className="size-5 shrink-0" />
          </Card>
        </Link>
      )}

      <Card variant="gradient" className="space-y-4">
        {cantando ? (
          <>
            <Badge>Cantando ahora</Badge>
            <div>
              <h1 className="text-title-1">{cantando.titulo}</h1>
              <p className="text-subhead text-grey">
                {cantando.nombre}
                {cantando.dueto_con && ` y ${cantando.dueto_con}`} · Mesa {cantando.mesa}
              </p>
            </div>
            <BarraReacciones solicitud={cantando} />
          </>
        ) : (
          <>
            <Badge variant="muted">Escenario libre</Badge>
            <h1 className="text-title-1">¿Quién se avienta la siguiente?</h1>
            <ButtonLink to="buscar" className="w-full">
              <Search className="size-5" /> Pedir canción
            </ButtonLink>
          </>
        )}
      </Card>

      {valorando && (
        <Card className="space-y-4">
          <Calificar solicitud={valorando} />
          <BarraReacciones solicitud={valorando} />
        </Card>
      )}

      {ultimoResultado && !valorando && (
        <Card className="space-y-2">
          <p className="text-center text-subhead text-grey">
            {ultimoResultado.nombre} · {ultimoResultado.titulo}
          </p>
          <ResultadoVotacion solicitud={ultimoResultado} />
        </Card>
      )}

      {siguiente && (
        <Card variant="outline" className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-caption text-grey">Sigue</p>
            <p className="truncate text-headline">
              <span className="text-lava">{siguiente.iniciales}</span> · {siguiente.titulo}
            </p>
          </div>
          <span className="shrink-0 text-subhead text-grey">{enEspera.length + (llamada ? 1 : 0)} en la fila</span>
        </Card>
      )}

      {listas.map((lista) => (
        <SeccionLista key={lista.id} lista={lista} alElegir={(cancion) => setPedido({ cancion })} />
      ))}

      <HojaPedido pedido={pedido} alCerrar={() => setPedido(null)} />
    </>
  )
}

const VISIBLES = 4

function SeccionLista({ lista, alElegir }: { lista: Lista; alElegir: (c: Lista['canciones'][number]) => void }) {
  const [todas, setTodas] = useState(false)
  const canciones = todas ? lista.canciones : lista.canciones.slice(0, VISIBLES)
  return (
    <section className="space-y-1 pt-2">
      <h2 className="text-title-2">{lista.titulo}</h2>
      <div>
        {canciones.map((c) => (
          <CancionItem key={c.id} titulo={c.titulo} artista={c.artista} onClick={() => alElegir(c)} />
        ))}
      </div>
      {lista.canciones.length > VISIBLES && (
        <Button variant="ghost" size="sm" className="w-full" onClick={() => setTodas(!todas)}>
          {todas ? 'Ver menos' : `Ver las ${lista.canciones.length}`}
        </Button>
      )}
    </section>
  )
}
