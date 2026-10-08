import { Badge, Card, Placeholder } from '@/components/ui'

export default function Inicio() {
  return (
    <>
      <Card variant="gradient" className="space-y-3">
        <Badge>Cantando ahora</Badge>
        <h1 className="text-title-1">Título de la canción</h1>
        <p className="text-subhead text-grey">Artista · Mesa 7</p>
      </Card>
      <Card variant="outline" className="flex items-end justify-between">
        <div>
          <p className="text-caption text-grey">Sigue</p>
          <p className="text-headline">LUP · Bamboleo</p>
        </div>
        <span className="text-title-2 text-lava">2</span>
      </Card>
      <Placeholder
        title="Inicio"
        feature="catalogo"
        items={[
          'Listas: Lo más pedido, Favoritas del DJ, Norteño y banda…',
          'Acceso rápido a pedir canción',
          'Estado de mi turno',
        ]}
      />
    </>
  )
}
