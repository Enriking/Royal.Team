import { NavLink, Outlet, useParams } from 'react-router'
import { Badge, Logo } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { NavItem } from './types'

/** Marco de la app del cliente (celular): barra superior + navegación inferior. */
export function ClientShell({ tabs }: { tabs: NavItem[] }) {
  const { mesa } = useParams()
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-jet/90 px-5 py-4 backdrop-blur">
        <Logo size="sm" />
        <Badge variant="outline">Mesa {mesa}</Badge>
      </header>
      <main className="flex-1 space-y-4 px-5 pb-28">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t border-line bg-midnight/95 px-2 pt-3 pb-[max(env(safe-area-inset-bottom),12px)] backdrop-blur">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-1 text-caption', isActive ? 'text-lava' : 'text-grey')
            }
          >
            <Icon className="size-6" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
