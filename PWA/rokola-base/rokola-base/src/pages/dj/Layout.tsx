import { Disc3, Inbox, ListOrdered } from 'lucide-react'
import { useEffect } from 'react'
import { DashShell } from '@/components/layout/DashShell'
import { useFila } from '@/features/cola'
import { useCierreAutomatico } from '@/features/votacion'

export default function DjLayout() {
  const { enRevision, enEspera } = useFila()
  useCierreAutomatico()

  // Si el panel está en otra pestaña, el título avisa cuántas solicitudes esperan
  useEffect(() => {
    const anterior = document.title
    document.title = enRevision.length ? `(${enRevision.length}) Panel del DJ · Rokola` : 'Panel del DJ · Rokola'
    return () => {
      document.title = anterior
    }
  }, [enRevision.length])

  return (
    <DashShell
      title="Panel del DJ"
      links={[
        { to: '/dj', label: 'Bandeja', icon: Inbox, end: true, badge: enRevision.length },
        { to: '/dj/fila', label: 'Fila', icon: ListOrdered, badge: enEspera.length },
        { to: '/dj/catalogo', label: 'Catálogo', icon: Disc3 },
      ]}
    />
  )
}
