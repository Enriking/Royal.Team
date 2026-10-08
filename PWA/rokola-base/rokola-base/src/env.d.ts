// Variables de entorno de Vite (archivo .env.local). Solo las que empiezan con VITE_ llegan al navegador.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
