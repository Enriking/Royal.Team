import type { LucideIcon } from 'lucide-react'

/** Elemento de menú de un marco (ClientShell o DashShell). */
export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean }
