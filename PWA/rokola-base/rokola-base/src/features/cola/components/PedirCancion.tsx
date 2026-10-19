import { Music, Plus, TriangleAlert } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { AreaTexto, avisar, Button, Campo, Hoja, Input, Interruptor } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useAjustes, type Cancion } from '@/lib/datos'
import { pedirCancion } from '../api'
import { guardarMesa, mesaGuardada } from '../mesa'
import { guardarPerfil, idParaNombre, usePerfiles } from '../perfiles'
import { limpiarIniciales, puedePedir, type DatosPedido } from '../reglas'
import { useSolicitudesNoche } from '../useCola'

/** Lo que se va a pedir: una canción del catálogo, o `cancion: null` para escribirla a mano. */
export type Pedido = { cancion: Pick<Cancion, 'id' | 'titulo' | 'artista'> | null }

/** Hoja para pedir canción. Al enviar, lleva a "Mi turno". */
export function HojaPedido({ pedido, alCerrar }: { pedido: Pedido | null; alCerrar: () => void }) {
  const navigate = useNavigate()
  return (
    <Hoja
      abierta={pedido !== null}
      alCerrar={alCerrar}
      titulo={pedido?.cancion === null ? 'Pide tu canción escrita' : 'Pide tu canción'}
    >
      {pedido && (
        <FormularioPedido
          cancion={pedido.cancion}
          alEnviar={() => {
            alCerrar()
            avisar('¡Listo! El DJ está revisando tu canción')
            navigate('/m/turno')
          }}
        />
      )}
    </Hoja>
  )
}

function FormularioPedido({ cancion, alEnviar }: { cancion: Pedido['cancion']; alEnviar: () => void }) {
  const perfiles = usePerfiles()
  const solicitudesNoche = useSolicitudesNoche()
  const ajustes = useAjustes()

  // null = "otra persona" (se escribe nombre e iniciales)
  const [perfilId, setPerfilId] = useState<string | null>(perfiles[0]?.id ?? null)
  const [nombre, setNombre] = useState('')
  const [iniciales, setIniciales] = useState('')
  const [inicialesEditadas, setInicialesEditadas] = useState(false)
  // Texto para que el campo pueda quedar vacío; se convierte a número al enviar
  const [mesa, setMesa] = useState(() => String(mesaGuardada() ?? ''))
  const [titulo, setTitulo] = useState('')
  const [artista, setArtista] = useState('')
  const [compite, setCompite] = useState(true)
  const [dueto, setDueto] = useState(false)
  const [duetoCon, setDuetoCon] = useState('')
  const [nota, setNota] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const perfil = perfiles.find((p) => p.id === perfilId) ?? null
  const permiso = puedePedir(solicitudesNoche, perfil?.id ?? '', ajustes)

  function cambiarNombre(valor: string) {
    setNombre(valor)
    if (!inicialesEditadas) setIniciales(limpiarIniciales(valor))
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const quien = perfil ?? { id: idParaNombre(nombre), nombre, iniciales }
    const datos: DatosPedido = {
      mesa: mesa.trim() === '' ? Number.NaN : Number(mesa),
      cantante_id: quien.id,
      nombre: quien.nombre,
      iniciales: quien.iniciales,
      cancion_id: cancion?.id ?? null,
      titulo: cancion?.titulo ?? titulo,
      artista: cancion?.artista ?? artista,
      dueto_con: dueto ? duetoCon.trim() || 'un acompañante' : null,
      nota,
      compite,
    }
    setEnviando(true)
    try {
      await pedirCancion(datos)
      guardarPerfil({ id: quien.id, nombre: datos.nombre, iniciales: datos.iniciales })
      guardarMesa(datos.mesa)
      alEnviar()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar. Intenta de nuevo.')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-5">
      {cancion ? (
        <div className="flex items-center gap-3 rounded-card bg-surface p-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-field bg-lava text-jet">
            <Music className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-headline">{cancion.titulo}</p>
            <p className="truncate text-subhead text-grey">{cancion.artista || 'Artista desconocido'}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Campo etiqueta="Canción">
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Nombre de la canción"
              required
            />
          </Campo>
          <Campo etiqueta="Artista" ayuda="El DJ revisará si la tiene.">
            <Input value={artista} onChange={(e) => setArtista(e.target.value)} placeholder="¿Quién la canta?" />
          </Campo>
        </div>
      )}

      <fieldset className="space-y-3">
        <legend className="mb-2 text-subhead font-medium text-grey">¿Quién canta y en qué mesa?</legend>
        {perfiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {perfiles.map((p) => (
              <Chip key={p.id} activo={perfilId === p.id} onClick={() => setPerfilId(p.id)}>
                <span className="font-bold text-lava">{p.iniciales}</span> {p.nombre}
              </Chip>
            ))}
            <Chip activo={perfilId === null} onClick={() => setPerfilId(null)}>
              <Plus className="size-4" /> Otra persona
            </Chip>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {perfilId === null && (
            <>
              <Campo etiqueta="Nombre" className="col-span-2">
                <Input
                  value={nombre}
                  onChange={(e) => cambiarNombre(e.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="given-name"
                  maxLength={30}
                  required
                />
              </Campo>
              <Campo etiqueta="Iniciales">
                <Input
                  value={iniciales}
                  onChange={(e) => {
                    setIniciales(limpiarIniciales(e.target.value))
                    setInicialesEditadas(true)
                  }}
                  placeholder="ABC"
                  className="text-center font-bold tracking-[0.3em] uppercase"
                  maxLength={3}
                  autoCapitalize="characters"
                  required
                />
              </Campo>
            </>
          )}
          <Campo etiqueta="Mesa">
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              max={ajustes.total_mesas}
              step={1}
              value={mesa}
              onChange={(e) => setMesa(e.target.value)}
              placeholder={`1–${ajustes.total_mesas}`}
              className="text-center font-bold"
              required
            />
          </Campo>
        </div>
      </fieldset>

      <div className="space-y-4 rounded-card bg-surface p-4">
        <Interruptor
          etiqueta="Quiero competir"
          detalle="Entras al ranking de la noche con tus iniciales"
          activo={compite}
          alCambiar={setCompite}
        />
        <Interruptor etiqueta="Es dueto" activo={dueto} alCambiar={setDueto} />
        {dueto && (
          <Input
            value={duetoCon}
            onChange={(e) => setDuetoCon(e.target.value)}
            placeholder="¿Con quién cantas?"
            aria-label="Con quién cantas"
            maxLength={40}
          />
        )}
      </div>

      <Campo etiqueta="Nota para el DJ (opcional)">
        <AreaTexto
          rows={2}
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          maxLength={140}
          placeholder="Ej. es cumpleaños de mi amiga 🎂"
        />
      </Campo>

      {!permiso.ok && <Alerta>{permiso.motivo}</Alerta>}
      {error && <Alerta>{error}</Alerta>}

      <Button type="submit" size="lg" className="w-full" disabled={!permiso.ok || enviando}>
        {enviando ? 'Enviando…' : 'Pedir canción'}
      </Button>
    </form>
  )
}

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 rounded-pill border px-4 text-subhead',
        activo ? 'border-lava bg-lava-soft text-offwhite' : 'border-line text-grey',
      )}
    >
      {children}
    </button>
  )
}

function Alerta({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="flex gap-2 rounded-field bg-danger/15 p-3 text-subhead text-offwhite">
      <TriangleAlert className="size-5 shrink-0 text-danger" />
      {children}
    </p>
  )
}
