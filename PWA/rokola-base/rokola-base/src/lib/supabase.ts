import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Cliente único de Supabase para toda la app, tipado con el esquema de la base (database.types.ts).
 * Mientras no exista .env.local, queda en null y la app funciona sin datos.
 */
export const supabase = url && anonKey ? createClient<Database>(url, anonKey) : null

if (import.meta.env.DEV && !supabase) {
  console.info('[Rokola] Supabase sin configurar: copia .env.example como .env.local y llena los datos.')
}
