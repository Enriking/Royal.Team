import { Link } from 'react-router'
import { Button, Card, conAviso, Logo } from '@/components/ui'
import { cargarCatalogoDemo } from '@/features/catalogo'
import { simularPedidos } from '@/features/cola'
import { borrarTodo, useTabla } from '@/lib/datos'

const views = [
  { to: '/m', title: 'App del cliente', desc: 'Lo que ve el cliente al escanear el QR (la mesa se escribe al pedir)' },
  { to: '/dj', title: 'Panel del DJ', desc: 'Bandeja, fila, votación y catálogo' },
  { to: '/pantalla', title: 'Pantalla del bar', desc: 'Escenario, siguientes turnos, récords y QR en la TV' },
  { to: '/dueno', title: 'Panel del dueño', desc: 'Estadísticas, ajustes y QR para las mesas' },
  { to: '/design', title: 'Sistema de diseño', desc: 'Colores, tipografía y componentes' },
]

/** Página de inicio para desarrollo: acceso rápido a cada vista y datos de prueba. */
export default function Hub() {
  const canciones = useTabla('canciones').length
  const solicitudes = useTabla('solicitudes').length

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

      <Card className="space-y-4">
        <div>
          <h2 className="text-title-2">Datos de prueba</h2>
          <p className="text-subhead text-grey">
            {canciones} canciones en el catálogo · {solicitudes} solicitudes guardadas en este navegador
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => conAviso(cargarCatalogoDemo, 'Catálogo de ejemplo cargado')}>
            Cargar catálogo de ejemplo
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => conAviso(() => simularPedidos(5), '5 pedidos simulados')}
          >
            Simular 5 pedidos
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (window.confirm('¿Borrar todos los datos de este navegador?')) {
                void conAviso(borrarTodo, 'Datos borrados')
              }
            }}
          >
            Borrar todo
          </Button>
        </div>
        <ol className="list-decimal space-y-1 pl-5 text-subhead text-grey">
          <li>Abre el cliente, el panel del DJ y la pantalla en pestañas distintas: se sincronizan solas.</li>
          <li>Pide una canción desde el cliente (o simula pedidos) y apruébala en la Bandeja del DJ.</li>
          <li>En Fila: llama, empieza y marca “Terminó”. Califica y reacciona desde el cliente.</li>
          <li>La pantalla muestra el puntaje; el ranking y las estadísticas se llenan solos.</li>
        </ol>
      </Card>
    </div>
  )
}
