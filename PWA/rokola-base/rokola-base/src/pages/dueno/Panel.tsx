import { BarChart3 } from 'lucide-react'
import { useState } from 'react'
import { Barras, Card, Columnas, Segmentos, Vacio } from '@/components/ui'
import { useEstadisticas, type Conteo, type Periodo } from '@/features/ranking'

export default function Panel() {
  const [periodo, setPeriodo] = useState<Periodo>('noche')
  const e = useEstadisticas(periodo)

  const indicadores = [
    { etiqueta: 'Pedidos', valor: e.pedidos },
    { etiqueta: 'Canciones cantadas', valor: e.cantadas },
    { etiqueta: 'Cantantes distintos', valor: e.cantantes },
    { etiqueta: 'Mesas que pidieron', valor: e.mesas },
    { etiqueta: 'Espera promedio', valor: e.esperaPromedio === null ? '—' : `${e.esperaPromedio} min` },
    { etiqueta: 'Puntaje promedio', valor: e.puntajePromedio ?? '—' },
  ]

  return (
    <>
      <h1 className="text-title-1">Estadísticas</h1>
      <Segmentos
        className="max-w-md"
        opciones={[
          { valor: 'noche', texto: 'Esta noche' },
          { valor: 'semana', texto: '7 días' },
          { valor: 'mes', texto: 'Este mes' },
        ]}
        valor={periodo}
        alCambiar={setPeriodo}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {indicadores.map((i) => (
          <Card key={i.etiqueta} className="space-y-1">
            <p className="text-caption text-grey">{i.etiqueta}</p>
            <p className="text-title-1">{i.valor}</p>
          </Card>
        ))}
      </div>

      {e.pedidos === 0 ? (
        <Vacio icono={BarChart3} titulo="Todavía no hay pedidos en este periodo">
          <p>Las gráficas aparecen en cuanto las mesas empiecen a pedir canciones.</p>
        </Vacio>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="space-y-4">
              <h2 className="text-headline">Pedidos por hora</h2>
              <Columnas
                datos={e.porHora.map((h) => ({ etiqueta: `${h.hora}h`, valor: h.pedidos }))}
                columna="Hora"
                unidad="pedidos"
              />
            </Card>
            <Card className="space-y-4">
              <h2 className="text-headline">Géneros más pedidos</h2>
              {e.porGenero.length ? (
                <Barras
                  datos={e.porGenero.map((g) => ({ etiqueta: g.genero, valor: g.veces }))}
                  columna="Género"
                  unidad="Pedidos"
                />
              ) : (
                <p className="text-subhead text-grey">Las canciones pedidas aún no tienen género en el catálogo.</p>
              )}
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="space-y-3">
              <h2 className="text-headline">Lo más pedido</h2>
              <ListaConteo conteos={e.masPedidas} />
            </Card>
            <Card className="space-y-3">
              <div>
                <h2 className="text-headline">Piden y no tenemos</h2>
                <p className="text-caption text-grey">Pedidas como texto libre: buenas candidatas para el catálogo.</p>
              </div>
              <ListaConteo conteos={e.faltantes} vacio="Todo lo que pidieron estaba en el catálogo." />
            </Card>
          </div>
        </>
      )}
    </>
  )
}

function ListaConteo({ conteos, vacio = 'Sin datos todavía.' }: { conteos: Conteo[]; vacio?: string }) {
  if (conteos.length === 0) return <p className="text-subhead text-grey">{vacio}</p>
  return (
    <table className="w-full text-left text-subhead">
      <thead className="text-caption text-grey">
        <tr className="border-b border-line">
          <th className="py-2 font-medium">Canción</th>
          <th className="py-2 text-right font-medium">Veces</th>
        </tr>
      </thead>
      <tbody>
        {conteos.map((c) => (
          <tr key={`${c.titulo}|${c.artista}`} className="border-b border-line/50">
            <td className="py-2">
              {c.titulo}
              {c.artista && <span className="text-grey"> · {c.artista}</span>}
            </td>
            <td className="py-2 text-right tabular-nums">{c.veces}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
