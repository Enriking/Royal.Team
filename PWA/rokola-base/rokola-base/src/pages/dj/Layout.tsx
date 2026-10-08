import { Inbox, ListOrdered } from 'lucide-react'
import { DashShell } from '@/components/layout/DashShell'

export default function DjLayout() {
  return (
    <DashShell
      title="Panel del DJ"
      links={[
        { to: '/dj', label: 'Bandeja', icon: Inbox, end: true },
        { to: '/dj/fila', label: 'Fila', icon: ListOrdered },
      ]}
    />
  )
}
