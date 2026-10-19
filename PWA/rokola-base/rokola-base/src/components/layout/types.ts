import type { LucideIcon } from 'lucide-react'

/** Elemento de menú de un marco (ClientShell o DashShell). `badge` muestra un contador (se oculta en 0). */
export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean; badge?: number }
