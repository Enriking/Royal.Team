import { Home, ListOrdered, Search, Trophy } from 'lucide-react'
import { ClientShell } from '@/components/layout/ClientShell'

export default function ClienteLayout() {
  return (
    <ClientShell
      tabs={[
        { to: '', label: 'Inicio', icon: Home, end: true },
        { to: 'buscar', label: 'Buscar', icon: Search },
        { to: 'turno', label: 'Mi turno', icon: ListOrdered },
        { to: 'ranking', label: 'Ranking', icon: Trophy },
      ]}
    />
  )
}
