import { Home, ListOrdered, Search, Trophy } from 'lucide-react'
import { ClientShell } from '@/components/layout/ClientShell'
import { proximaMia, useAvisoTurno, useMisSolicitudes } from '@/features/cola'

export default function ClienteLayout() {
  const mias = useMisSolicitudes()
  useAvisoTurno(mias)
  const proxima = proximaMia(mias)

  return (
    <ClientShell
      tabs={[
        { to: '', label: 'Inicio', icon: Home, end: true },
        { to: 'buscar', label: 'Buscar', icon: Search },
        {
          to: 'turno',
          label: 'Mi turno',
          icon: ListOrdered,
          badge: proxima?.turnos != null ? proxima.turnos + 1 : undefined,
        },
        { to: 'ranking', label: 'Ranking', icon: Trophy },
      ]}
    />
  )
}
