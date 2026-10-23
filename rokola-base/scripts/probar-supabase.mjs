// Prueba de conexión con Supabase. Uso: node --env-file=.env.local scripts/probar-supabase.mjs
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const clave = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !clave) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(url, clave)

// 1) Lectura: cuenta las canciones y muestra las primeras 5
const { data, count, error } = await supabase.from('canciones').select('titulo, artista', { count: 'exact' }).limit(5)

if (error) {
  console.error('Error de conexión:', error.message)
  process.exit(1)
}
console.log(`Conexión correcta: ${count} canciones en la tabla`)
console.table(data)

// 2) Tiempo real: escucha las canciones nuevas durante 60 segundos
supabase
  .channel('prueba-canciones')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'canciones' }, (cambio) => {
    console.log('Nueva canción en tiempo real:', cambio.new.titulo, '-', cambio.new.artista)
  })
  .subscribe((estado) => console.log('Canal de tiempo real:', estado))

setTimeout(() => process.exit(0), 60_000)
