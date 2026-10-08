import { Badge, Button, Card, Placeholder } from '@/components/ui'

export default function Bandeja() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-title-1">Bandeja</h1>
        <Badge>3 nuevas</Badge>
      </div>
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-headline">Bamboleo · Gipsy Kings</p>
          <p className="text-subhead text-grey">Lupita · Mesa 12 · Ronda 1</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Rechazar
          </Button>
          <Button size="sm">Aprobar</Button>
        </div>
      </Card>
      <Placeholder
        title="Solicitudes nuevas"
        feature="cola"
        items={['Llegan en tiempo real desde las mesas', 'Aprobar / rechazar con motivo']}
      />
    </>
  )
}
