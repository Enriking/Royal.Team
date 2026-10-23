import { Disc3, Search, Star, Upload } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Badge, Button, Campo, conAviso, Hoja, Input, Interruptor, Vacio } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useTabla, type Cancion } from '@/lib/datos'
import { actualizarCancion, borrarCanciones, cargarCatalogoDemo } from '../api'
import { useBusqueda } from '../useCatalogo'
import { CancionItem } from './CancionItem'
import { ImportarCanciones } from './ImportarCanciones'

const PAGINA = 100

/** Catálogo para el DJ: buscar, importar, marcar favoritas y duetos, editar y borrar. */
export function GestorCatalogo() {
  const canciones = useTabla('canciones')
  const [consulta, setConsulta] = useState('')
  const [limite, setLimite] = useState(PAGINA)
  const [importando, setImportando] = useState(false)
  const [editando, setEditando] = useState<Cancion | null>(null)
  const { resultados } = useBusqueda(consulta, limite)

  const ordenadas = useMemo(() => [...canciones].sort((a, b) => a.titulo.localeCompare(b.titulo, 'es')), [canciones])
  const lista = consulta.trim() ? resultados : ordenadas.slice(0, limite)
  // Con búsqueda no se sabe el total: si llenó la página, puede haber más
  const hayMas = consulta.trim() ? resultados.length === limite : ordenadas.length > limite

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-title-1">Catálogo</h1>
          <Badge variant="muted">{canciones.length} canciones</Badge>
        </div>
        <Button size="sm" onClick={() => setImportando(true)}>
          <Upload className="size-4" />
          Importar
        </Button>
      </div>

      {canciones.length === 0 ? (
        <Vacio icono={Disc3} titulo="El catálogo está vacío">
          <p>Importa la carpeta de música del DJ o carga canciones de ejemplo para probar.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" onClick={() => setImportando(true)}>
              Importar canciones
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => conAviso(cargarCatalogoDemo, 'Catálogo de ejemplo cargado')}
            >
              Cargar ejemplo
            </Button>
          </div>
        </Vacio>
      ) : (
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute top-3.5 left-4 size-5 text-grey" />
            <Input
              type="search"
              value={consulta}
              onChange={(e) => {
                setConsulta(e.target.value)
                setLimite(PAGINA)
              }}
              placeholder="Buscar por título o artista"
              aria-label="Buscar en el catálogo"
              className="pl-12"
            />
          </div>
          <div className="divide-y divide-line/60">
            {lista.map((c) => (
              <CancionItem
                key={c.id}
                titulo={c.titulo}
                artista={c.artista}
                detalle={[c.genero, c.dueto && 'Dueto'].filter(Boolean).join(' · ') || null}
                onClick={() => setEditando(c)}
                derecha={
                  <button
                    type="button"
                    aria-label={c.favorita ? 'Quitar de favoritas' : 'Marcar como favorita'}
                    aria-pressed={c.favorita}
                    onClick={() => conAviso(() => actualizarCancion(c.id, { favorita: !c.favorita }))}
                    className="rounded-full p-2 hover:bg-surface"
                  >
                    <Star className={cn('size-5', c.favorita ? 'fill-lava text-lava' : 'text-grey')} />
                  </button>
                }
              />
            ))}
          </div>
          {lista.length === 0 && (
            <p className="text-center text-subhead text-grey">Sin resultados para “{consulta}”.</p>
          )}
          {hayMas && (
            <Button variant="secondary" className="w-full" onClick={() => setLimite((l) => l + PAGINA)}>
              Mostrar más
            </Button>
          )}
        </>
      )}

      <Hoja abierta={importando} alCerrar={() => setImportando(false)} titulo="Importar canciones">
        <ImportarCanciones alTerminar={() => setImportando(false)} />
      </Hoja>
      <Hoja abierta={editando !== null} alCerrar={() => setEditando(null)} titulo="Editar canción">
        {editando && <EditarCancion cancion={editando} alTerminar={() => setEditando(null)} />}
      </Hoja>
    </>
  )
}

function EditarCancion({ cancion, alTerminar }: { cancion: Cancion; alTerminar: () => void }) {
  const [datos, setDatos] = useState(cancion)
  const cambiar = (cambios: Partial<Cancion>) => setDatos((d) => ({ ...d, ...cambios }))

  async function guardar(e: FormEvent) {
    e.preventDefault()
    const ok = await conAviso(
      () =>
        actualizarCancion(cancion.id, {
          titulo: datos.titulo.trim() || cancion.titulo,
          artista: datos.artista.trim(),
          genero: datos.genero?.trim() || null,
          favorita: datos.favorita,
          dueto: datos.dueto,
        }),
      'Canción actualizada',
    )
    if (ok) alTerminar()
  }

  async function borrar() {
    if (!window.confirm(`¿Borrar “${cancion.titulo}” del catálogo?`)) return
    if (await conAviso(() => borrarCanciones([cancion.id]), 'Canción borrada')) alTerminar()
  }

  return (
    <form onSubmit={guardar} className="space-y-4">
      <Campo etiqueta="Título">
        <Input value={datos.titulo} onChange={(e) => cambiar({ titulo: e.target.value })} required />
      </Campo>
      <Campo etiqueta="Artista">
        <Input value={datos.artista} onChange={(e) => cambiar({ artista: e.target.value })} />
      </Campo>
      <Campo etiqueta="Género" ayuda="Norteño, Banda, Grupero o Duranguense aparecen en la lista “Norteño y banda”.">
        <Input value={datos.genero ?? ''} onChange={(e) => cambiar({ genero: e.target.value })} />
      </Campo>
      <Interruptor etiqueta="Favorita del DJ" activo={datos.favorita} alCambiar={(favorita) => cambiar({ favorita })} />
      <Interruptor etiqueta="Para dueto" activo={datos.dueto} alCambiar={(dueto) => cambiar({ dueto })} />
      {cancion.archivo && <p className="text-caption text-grey">Archivo: {cancion.archivo}</p>}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={borrar}>
          Borrar
        </Button>
        <Button type="submit" className="flex-1">
          Guardar
        </Button>
      </div>
    </form>
  )
}
