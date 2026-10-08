import { Placeholder } from '@/components/ui'

export default function Ranking() {
  return (
    <>
      <h1 className="pt-2 text-title-1">Ranking</h1>
      <Placeholder
        title="Récords de la noche"
        feature="ranking"
        items={['Top 10 con iniciales de 3 letras', 'Estrella de la noche', 'Salón de la fama del mes']}
      />
    </>
  )
}
