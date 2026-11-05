// ARCHIVO GENERADO: no se edita a mano.
// Se regenera con `npm run db:types` cada vez que cambie el esquema (supabase/migrations).
// Rama pruebas-experimentales: escrito a mano con el mismo formato de la CLI para las tablas
// `canciones` y `solicitudes`. Regenerarlo con `npm run db:types` después de `npm run db:push`.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      canciones: {
        Row: {
          id: string
          titulo: string
          artista: string
          genero: string | null
          favorita: boolean
          dueto: boolean
          archivo: string | null
          creada_en: string
        }
        Insert: {
          id?: string
          titulo: string
          artista: string
          genero?: string | null
          favorita?: boolean
          dueto?: boolean
          archivo?: string | null
          creada_en?: string
        }
        Update: {
          id?: string
          titulo?: string
          artista?: string
          genero?: string | null
          favorita?: boolean
          dueto?: boolean
          archivo?: string | null
          creada_en?: string
        }
        Relationships: []
      }
      solicitudes: {
        Row: {
          id: string
          noche: string
          creada_en: string
          mesa: number
          dispositivo_id: string
          cantante_id: string
          nombre: string
          iniciales: string
          cancion_id: string | null
          titulo: string
          artista: string
          dueto_con: string | null
          nota: string | null
          compite: boolean
          estado: string
          motivo_rechazo: string | null
          ronda: number | null
          orden: number | null
          aprobada_en: string | null
          llamada_en: string | null
          inicio_en: string | null
          fin_en: string | null
          cerrada_en: string | null
          aplausos: number | null
          energia: number | null
          calificacion: number | null
          puntaje: number | null
        }
        Insert: {
          id: string
          noche: string
          creada_en?: string
          mesa: number
          dispositivo_id: string
          cantante_id: string
          nombre: string
          iniciales: string
          cancion_id?: string | null
          titulo: string
          artista?: string
          dueto_con?: string | null
          nota?: string | null
          compite?: boolean
          estado?: string
          motivo_rechazo?: string | null
          ronda?: number | null
          orden?: number | null
          aprobada_en?: string | null
          llamada_en?: string | null
          inicio_en?: string | null
          fin_en?: string | null
          cerrada_en?: string | null
          aplausos?: number | null
          energia?: number | null
          calificacion?: number | null
          puntaje?: number | null
        }
        Update: {
          id?: string
          noche?: string
          creada_en?: string
          mesa?: number
          dispositivo_id?: string
          cantante_id?: string
          nombre?: string
          iniciales?: string
          cancion_id?: string | null
          titulo?: string
          artista?: string
          dueto_con?: string | null
          nota?: string | null
          compite?: boolean
          estado?: string
          motivo_rechazo?: string | null
          ronda?: number | null
          orden?: number | null
          aprobada_en?: string | null
          llamada_en?: string | null
          inicio_en?: string | null
          fin_en?: string | null
          cerrada_en?: string | null
          aplausos?: number | null
          energia?: number | null
          calificacion?: number | null
          puntaje?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'solicitudes_cancion_id_fkey'
            columns: ['cancion_id']
            isOneToOne: false
            referencedRelation: 'canciones'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
