import type { Solicitud } from '@/lib/datos'
import type { Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'

type FilaNueva = Database['public']['Tables']['solicitudes']['Insert']

/** Los campos que viajan a la tabla `solicitudes` de Supabase (los del DJ y la votación van vacíos). */
export function filaParaSupabase(s: Solicitud): FilaNueva {
  return {
    id: s.id,
    noche: s.noche,
    creada_en: s.creada_en,
    mesa: s.mesa,
    dispositivo_id: s.dispositivo_id,
    cantante_id: s.cantante_id,
    nombre: s.nombre,
    iniciales: s.iniciales,
    cancion_id: s.cancion_id,
    titulo: s.titulo,
    artista: s.artista,
    dueto_con: s.dueto_con,
    nota: s.nota,
    compite: s.compite,
    estado: 'en_revision',
  }
}

export type ResultadoEnvio = 'enviada' | 'sin-supabase' | 'error'

/**
 * EXPERIMENTAL: copia la solicitud nueva en Supabase.
 * La app sigue usando el almacén local como fuente principal; si Supabase no está configurado
 * o falla (sin internet, catálogo distinto), el pedido no se pierde: solo se registra el error.
 */
export async function enviarSolicitudASupabase(s: Solicitud): Promise<ResultadoEnvio> {
  if (!supabase) return 'sin-supabase'
  // Si la canción no está en el catálogo de Supabase, se guarda como texto libre para no romper la llave foránea.
  const fila = filaParaSupabase(s)
  let { error } = await supabase.from('solicitudes').insert(fila)
  if (error?.code === '23503') ({ error } = await supabase.from('solicitudes').insert({ ...fila, cancion_id: null }))
  if (error) {
    console.error('[Rokola] No se pudo guardar la solicitud en Supabase:', error.message)
    return 'error'
  }
  return 'enviada'
}
