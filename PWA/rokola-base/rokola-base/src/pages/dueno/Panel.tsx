import { Card, Placeholder } from '@/components/ui'

const stats = [
  { label: 'Pedidos hoy', value: '—' },
  { label: 'Cantantes distintos', value: '—' },
  { label: 'Espera promedio', value: '—' },
]

export default function Panel() {
  return (
    <>
      <h1 className="text-title-1">Panel del dueño</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-caption text-grey">{s.label}</p>
            <p className="text-title-1 text-lava">{s.value}</p>
          </Card>
        ))}
      </div>
      <Placeholder
        title="Estadísticas"
        feature="ranking"
        items={['Gráficas por hora y género', 'Canciones pedidas que no tenemos']}
      />
    </>
  )
}
