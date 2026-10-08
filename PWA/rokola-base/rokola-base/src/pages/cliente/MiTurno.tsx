import { Card, Placeholder } from '@/components/ui'

export default function MiTurno() {
  return (
    <>
      <h1 className="pt-2 text-title-1">Mi turno</h1>
      <Card variant="lava" className="flex items-center justify-between">
        <div>
          <p className="text-subhead font-semibold">Tu lugar</p>
          <p className="text-caption">≈ 20 min</p>
        </div>
        <span className="text-large-title">6</span>
      </Card>
      <Placeholder
        title="Fila y votación"
        feature="cola · votacion"
        items={['Estado de la solicitud en vivo', 'Aviso a 2 turnos (vibración)', 'Emojis y calificación al terminar']}
      />
    </>
  )
}
