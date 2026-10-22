import { BarChart3, Settings } from 'lucide-react'
import { DashShell } from '@/components/layout/DashShell'

export default function DuenoLayout() {
  return (
    <DashShell
      title="Panel del dueño"
      links={[
        { to: '/dueno', label: 'Estadísticas', icon: BarChart3, end: true },
        { to: '/dueno/ajustes', label: 'Ajustes', icon: Settings },
      ]}
    />
  )
}
