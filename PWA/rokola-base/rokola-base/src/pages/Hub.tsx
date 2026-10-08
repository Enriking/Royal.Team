import { Link } from 'react-router'
import { Card, Logo } from '@/components/ui'

const views = [
  { to: '/m/12', title: 'App del cliente', desc: 'Lo que ve el cliente al escanear el QR de la mesa 12' },
  { to: '/dj', title: 'Panel del DJ', desc: 'Bandeja, fila y control de turnos' },
  { to: '/pantalla', title: 'Pantalla del bar', desc: 'Rocola, fila y QR en la TV' },
  { to: '/dueno', title: 'Panel del dueño', desc: 'Estadísticas y configuración' },
  { to: '/design', title: 'Sistema de diseño', desc: 'Colores, tipografía y componentes' },
]

/** Página de inicio para desarrollo: acceso rápido a cada vista. */
export default function Hub() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 md:p-12">
      <div className="space-y-2">
        <Logo size="lg" />
        <p className="text-body text-grey">La fila del karaoke, desde el celular · base del proyecto</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {views.map((v) => (
          <Link key={v.to} to={v.to}>
            <Card className="h-full space-y-1 transition hover:shadow-glow">
              <p className="text-headline">{v.title}</p>
              <p className="text-subhead text-grey">{v.desc}</p>
              <p className="pt-2 text-caption text-lava">{v.to}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
