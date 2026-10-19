import { Badge } from '@/components/ui'
import type { EstadoSolicitud } from '@/lib/datos'

const estados: Record<EstadoSolicitud, { texto: string; variante: 'lava' | 'outline' | 'muted' }> = {
  en_revision: { texto: 'En revisión', variante: 'muted' },
  aprobada: { texto: 'En la fila', variante: 'outline' },
  llamada: { texto: '¡Te toca!', variante: 'lava' },
  cantando: { texto: 'Cantando', variante: 'lava' },
  valorando: { texto: 'Votación', variante: 'outline' },
  terminada: { texto: 'Cantada', variante: 'muted' },
  rechazada: { texto: 'No aceptada', variante: 'muted' },
  cancelada: { texto: 'Cancelada', variante: 'muted' },
}

export function EstadoBadge({ estado, className }: { estado: EstadoSolicitud; className?: string }) {
  const { texto, variante } = estados[estado]
  return (
    <Badge variant={variante} className={className}>
      {texto}
    </Badge>
  )
}
