import { Printer } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Button, Campo, Card, conAviso, Input, Qr } from '@/components/ui'
import {
  AJUSTES_INICIALES,
  borrarNoche,
  borrarTodo,
  enlaceCliente,
  guardarAjustes,
  LIMITES,
  nocheDe,
  qrApuntaALocal,
  useAjustes,
  validarAjustes,
  type Ajustes as TipoAjustes,
} from '@/lib/datos'

type CampoNumerico = keyof typeof LIMITES

export default function Ajustes() {
  const ajustes = useAjustes()
  const [borrador, setBorrador] = useState(ajustes)
  const [error, setError] = useState<string | null>(null)
  const cambiar = (cambios: Partial<TipoAjustes>) => setBorrador((b) => ({ ...b, ...cambios }))

  const numero = (campo: CampoNumerico, ayuda?: ReactNode) => (
    <NumeroCampo campo={campo} valor={borrador[campo]} alCambiar={(v) => cambiar({ [campo]: v })} ayuda={ayuda} />
  )

  async function guardar(e: FormEvent) {
    e.preventDefault()
    const final = { ...borrador, url_publica: borrador.url_publica.trim() }
    const problema = validarAjustes(final)
    setError(problema)
    if (problema) return
    // "Recibiendo canciones" lo controla el DJ en su bandeja: no se pisa desde aquí
    const { id: _id, aceptando: _aceptando, ...cambios } = final
    await conAviso(() => guardarAjustes(cambios), 'Ajustes guardados')
  }

  function restablecer() {
    setBorrador({ ...AJUSTES_INICIALES, aceptando: ajustes.aceptando })
    setError(null)
  }

  const sumaPesos = borrador.peso_aplausos + borrador.peso_calificacion + borrador.peso_energia

  return (
    <>
      <h1 className="text-title-1 print:hidden">Ajustes</h1>

      <form onSubmit={guardar} className="space-y-4 print:hidden">
        <Seccion titulo="El bar">
          <Campo etiqueta="Nombre del bar">
            <Input value={borrador.nombre_bar} onChange={(e) => cambiar({ nombre_bar: e.target.value })} />
          </Campo>
          <Campo
            etiqueta="Dirección pública (para los QR)"
            ayuda={`Ej. https://rokola.mx. Vacía = la dirección con la que abriste esta página (${window.location.origin}).`}
          >
            <Input
              type="url"
              value={borrador.url_publica}
              onChange={(e) => cambiar({ url_publica: e.target.value })}
              placeholder="https://"
            />
          </Campo>
          {numero('total_mesas', 'El cliente escribe su número de mesa (del 1 a este) al pedir canción.')}
        </Seccion>

        <Seccion titulo="Fila">
          {numero('max_pendientes', 'Canciones sin cantar que puede tener cada persona a la vez.')}
          {numero('minutos_por_turno', 'Para estimar la espera que ve cada cliente.')}
        </Seccion>

        <Seccion titulo="Votación y puntaje">
          {numero('segundos_votacion', 'Tiempo para calificar después de que alguien termina.')}
          {numero('max_reacciones', 'Emojis que puede mandar cada celular por canción.')}
          {numero('reacciones_energia_max', 'Con cuántas reacciones en total la energía llega a 100.')}
          <div className="grid gap-4 sm:grid-cols-3">
            {numero('peso_aplausos')}
            {numero('peso_calificacion')}
            {numero('peso_energia')}
          </div>
          <p className="text-caption text-grey">
            Los pesos suman {Number.isNaN(sumaPesos) ? '—' : sumaPesos}%
            {sumaPesos !== 100 && '; se reparten en proporción'}. Si no hay aplausómetro, su peso se reparte entre los
            otros dos.
          </p>
        </Seccion>

        {error && (
          <p role="alert" className="rounded-field bg-danger/15 p-3 text-subhead">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Guardar cambios</Button>
          <Button variant="ghost" onClick={restablecer}>
            Valores iniciales
          </Button>
        </div>
      </form>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <h2 className="text-title-2">Código QR para las mesas</h2>
            <p className="text-subhead text-grey">
              Es el mismo para todas: imprímelo y pégalo en cada mesa. El cliente escribe su número de mesa al pedir.
            </p>
          </div>
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="size-4" /> Imprimir
          </Button>
        </div>
        {qrApuntaALocal(ajustes) && (
          <p className="rounded-field border border-lava/50 p-3 text-subhead print:hidden">
            Estos QR apuntan a “localhost” y no abrirán en los celulares. Pon la dirección pública arriba, o abre esta
            página con la dirección “Network” de npm run dev para probar en la red local.
          </p>
        )}
        <div className="max-w-64 space-y-2 rounded-card border border-line bg-offwhite p-4 text-center text-jet">
          <Qr valor={enlaceCliente(ajustes)} titulo="QR para pedir canción" className="mx-auto w-full" />
          <p className="text-title-2">Escanea y pide tu canción</p>
          <p className="text-caption">{ajustes.nombre_bar}</p>
        </div>
      </section>

      <Seccion titulo="Datos" className="border border-danger/40 print:hidden">
        <p className="text-subhead text-grey">
          Sin conexión a Supabase, los datos viven en este navegador. Borrarlos no se puede deshacer.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              if (window.confirm('¿Borrar los pedidos, votos y reacciones de esta noche?')) {
                void conAviso(() => borrarNoche(nocheDe()), 'Se borró la noche de hoy')
              }
            }}
          >
            Borrar la noche de hoy
          </Button>
          <Button
            variant="ghost"
            className="text-danger hover:text-danger"
            onClick={() => {
              if (window.confirm('¿Borrar TODO (catálogo, historial y ajustes)? No se puede deshacer.')) {
                void conAviso(borrarTodo, 'Se borraron todos los datos')
              }
            }}
          >
            Borrar todo
          </Button>
        </div>
      </Seccion>
    </>
  )
}

function Seccion({ titulo, className, children }: { titulo: string; className?: string; children: ReactNode }) {
  return (
    <Card className={className}>
      <fieldset className="space-y-4">
        <legend className="mb-4 text-title-2">{titulo}</legend>
        {children}
      </fieldset>
    </Card>
  )
}

function NumeroCampo({
  campo,
  valor,
  alCambiar,
  ayuda,
}: {
  campo: CampoNumerico
  valor: number
  alCambiar: (valor: number) => void
  ayuda?: ReactNode
}) {
  const { etiqueta, min, max } = LIMITES[campo]
  return (
    <Campo etiqueta={etiqueta} ayuda={ayuda}>
      <Input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={Number.isNaN(valor) ? '' : valor}
        onChange={(e) => alCambiar(e.target.value === '' ? Number.NaN : Number(e.target.value))}
        className="max-w-40"
      />
    </Campo>
  )
}
