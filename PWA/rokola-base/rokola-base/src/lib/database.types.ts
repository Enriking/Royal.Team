// ARCHIVO GENERADO: no se edita a mano.
// Se regenera con `npm run db:types` cada vez que cambie el esquema (supabase/migrations).
// Por ahora la base no tiene tablas; este es el formato vacío que produce la CLI de Supabase.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      [_ in never]: never
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
