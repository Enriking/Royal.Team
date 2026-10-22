import { ClipboardPaste, FolderOpen } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AreaTexto, avisar, Button, conAviso, Interruptor, Segmentos } from '@/components/ui'
import { useTabla } from '@/lib/datos'
import { agregarCanciones } from '../api'
import {
  carpetaDe,
  esArchivoDeMusica,
  parsearArchivo,
  parsearTexto,
  sinRepetidas,
  type CancionNueva,
} from '../importar'
import { CancionItem } from './CancionItem'

type Origen = 'carpeta' | 'texto'

/** Agrega canciones desde la carpeta de música del DJ (solo lee los nombres) o desde una lista pegada. */
export function ImportarCanciones({ alTerminar }: { alTerminar: () => void }) {
  const canciones = useTabla('canciones')
  const [origen, setOrigen] = useState<Origen>('carpeta')
  const [rutas, setRutas] = useState<string[]>([])
  const [texto, setTexto] = useState('')
  const [invertir, setInvertir] = useState(false)
  const [generoCarpeta, setGeneroCarpeta] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const candidatas = useMemo<CancionNueva[]>(() => {
    if (origen === 'texto') return parsearTexto(texto, invertir)
    return rutas.flatMap((ruta) => {
      const cancion = parsearArchivo(ruta, invertir)
      return cancion ? [{ ...cancion, genero: generoCarpeta ? carpetaDe(ruta) : null }] : []
    })
  }, [origen, texto, rutas, invertir, generoCarpeta])

  const nuevas = useMemo(() => sinRepetidas(canciones, candidatas), [canciones, candidatas])
  const repetidas = candidatas.length - nuevas.length

  function elegir(archivos: FileList | null) {
    setRutas(Array.from(archivos ?? [], (f) => f.webkitRelativePath || f.name).filter(esArchivoDeMusica))
  }

  async function agregar() {
    setGuardando(true)
    const ok = await conAviso(async () => {
      const total = await agregarCanciones(candidatas)
      avisar(total === 1 ? '1 canción agregada al catálogo' : `${total} canciones agregadas al catálogo`)
    })
    setGuardando(false)
    if (ok) alTerminar()
  }

  return (
    <div className="space-y-4">
      <Segmentos
        opciones={[
          { valor: 'carpeta', texto: 'Carpeta', icono: FolderOpen },
          { valor: 'texto', texto: 'Pegar lista', icono: ClipboardPaste },
        ]}
        valor={origen}
        alCambiar={setOrigen}
      />

      {origen === 'carpeta' ? (
        <div className="space-y-2">
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-card border border-dashed border-line p-6 text-center focus-within:border-lava hover:border-lava">
            <FolderOpen className="size-8 text-lava" />
            <span className="text-headline">
              {rutas.length ? `${rutas.length} archivos leídos` : 'Elegir la carpeta de música'}
            </span>
            <span className="text-caption text-grey">
              Solo se leen los nombres de los archivos ("Artista - Título.mp3"). Si el navegador pregunta si quieres
              "subir" la carpeta, acepta: nada sale de esta computadora.
            </span>
            <input
              type="file"
              multiple
              className="sr-only"
              ref={(el) => el?.setAttribute('webkitdirectory', '')}
              onChange={(e) => elegir(e.target.files)}
            />
          </label>
          <label className="block cursor-pointer text-center text-caption text-lava">
            o elegir archivos sueltos
            <input type="file" multiple className="sr-only" onChange={(e) => elegir(e.target.files)} />
          </label>
          <Interruptor
            etiqueta="Usar la carpeta como género"
            detalle='Ej. "Karaoke/Banda/…" queda con género "Banda"'
            activo={generoCarpeta}
            alCambiar={setGeneroCarpeta}
          />
        </div>
      ) : (
        <AreaTexto
          rows={6}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={
            'Un renglón por canción:\nManá - Rayando el sol\n\nO pega desde Excel las columnas Título, Artista y Género'
          }
        />
      )}

      <Interruptor
        etiqueta='Los nombres están como "Título - Artista"'
        detalle='Lo normal es "Artista - Título"'
        activo={invertir}
        alCambiar={setInvertir}
      />

      {candidatas.length > 0 && (
        <div className="space-y-2 rounded-card bg-surface p-3">
          <p className="px-2 text-subhead text-grey">
            <span className="font-semibold text-offwhite">{nuevas.length} nuevas</span>
            {repetidas > 0 && ` · ${repetidas} ya estaban o venían repetidas`}
          </p>
          {nuevas.slice(0, 5).map((c) => (
            <CancionItem key={c.id} titulo={c.titulo} artista={c.artista} detalle={c.genero} />
          ))}
          {nuevas.length > 5 && <p className="px-2 text-caption text-grey">y {nuevas.length - 5} más…</p>}
        </div>
      )}

      <Button className="w-full" disabled={nuevas.length === 0 || guardando} onClick={agregar}>
        {nuevas.length ? `Agregar ${nuevas.length} al catálogo` : 'Agregar al catálogo'}
      </Button>
    </div>
  )
}
