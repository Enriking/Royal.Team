import { NavLink, Outlet } from 'react-router'
import { Logo } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { NavItem } from './types'

/** Marco de los paneles (DJ y dueño): menú lateral en tablet/escritorio, barra superior en celular. */
export function DashShell({ title, links }: { title: string; links: NavItem[] }) {
  const nav = links.map(({ to, label, icon: Icon, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex shrink-0 items-center gap-3 rounded-field px-3 py-2.5 text-subhead font-medium',
          isActive ? 'bg-lava-soft text-lava' : 'text-grey hover:bg-surface hover:text-offwhite',
        )
      }
    >
      <Icon className="size-5" />
      {label}
    </NavLink>
  ))

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="hidden w-64 shrink-0 flex-col gap-8 border-r border-line bg-midnight p-6 md:flex">
        <div className="space-y-1">
          <Logo />
          <p className="text-caption tracking-[0.2em] text-grey uppercase">{title}</p>
        </div>
        <nav className="flex flex-col gap-1">{nav}</nav>
      </aside>
      <header className="sticky top-0 z-10 space-y-3 border-b border-line bg-midnight/95 px-4 pt-4 pb-2 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-caption tracking-[0.2em] text-grey uppercase">{title}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto">{nav}</nav>
      </header>
      <main className="min-w-0 flex-1 space-y-6 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
