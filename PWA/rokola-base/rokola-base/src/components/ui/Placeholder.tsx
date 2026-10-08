import { Card } from './Card'

/** Marcador temporal para vistas que aún no se construyen. */
export function Placeholder({ title, feature, items }: { title: string; feature: string; items: string[] }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-title-2">{title}</h2>
        <span className="rounded-lg border border-lava px-2 py-1 text-caption text-lava">en construcción</span>
      </div>
      <ul className="space-y-2 text-subhead text-grey">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="text-lava">•</span>
            {i}
          </li>
        ))}
      </ul>
      <p className="text-caption text-grey-strong">Código en src/features/{feature}</p>
    </Card>
  )
}
