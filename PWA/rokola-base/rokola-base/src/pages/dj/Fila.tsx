import { Badge } from '@/components/ui'
import { EscenarioDj, FilaDj, useFila } from '@/features/cola'
import { VotacionDj } from '@/features/votacion'

export default function Fila() {
  const { valorando, enEspera } = useFila()
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-title-1">Fila</h1>
        <Badge variant="muted">{enEspera.length} en espera</Badge>
      </div>
      <EscenarioDj />
      {valorando && <VotacionDj solicitud={valorando} />}
      <FilaDj />
    </>
  )
}
