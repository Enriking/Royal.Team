import { describe, expect, it } from 'vitest'
import type { Solicitud } from '@/lib/datos'
import { enviarSolicitudASupabase, filaParaSupabase } from './supabaseSolicitudes'

const solicitud: Solicitud = {
  id: '6f1c2c8e-1d2a-4b7e-9a51-0c3f4d5e6a7b',
  noche: '2026-11-05',
  creada_en: '2026-11-06T03:15:00.000Z',
  mesa: 12,
  dispositivo_id: 'cel-1',
  cantante_id: 'cel-1:waldo',
  nombre: 'Waldo',
  iniciales: 'WAL',
  cancion_id: null,
  titulo: 'Fly Me to the Moon',
  artista: 'Frank Sinatra',
  dueto_con: null,
  nota: 'Primera vez que canto',
  compite: true,
  estado: 'aprobada',
  motivo_rechazo: null,
  ronda: 1,
  orden: 5,
  aprobada_en: '2026-11-06T03:16:00.000Z',
  llamada_en: null,
  inicio_en: null,
  fin_en: null,
  cerrada_en: null,
  aplausos: 80,
  energia: null,
  calificacion: null,
  puntaje: 90,
}

describe('filaParaSupabase', () => {
  it('envía los datos del pedido: cliente, mesa y canción', () => {
    expect(filaParaSupabase(solicitud)).toMatchObject({
      nombre: 'Waldo',
      iniciales: 'WAL',
      mesa: 12,
      titulo: 'Fly Me to the Moon',
      artista: 'Frank Sinatra',
      nota: 'Primera vez que canto',
      compite: true,
    })
  })

  it('siempre llega como "en revisión" y sin campos del DJ ni de la votación', () => {
    const fila = filaParaSupabase(solicitud)
    expect(fila.estado).toBe('en_revision')
    for (const campo of ['ronda', 'orden', 'aprobada_en', 'aplausos', 'puntaje']) expect(fila).not.toHaveProperty(campo)
  })
})

describe('enviarSolicitudASupabase', () => {
  it('sin variables de entorno no intenta conectarse', async () => {
    await expect(enviarSolicitudASupabase(solicitud)).resolves.toBe('sin-supabase')
  })
})
