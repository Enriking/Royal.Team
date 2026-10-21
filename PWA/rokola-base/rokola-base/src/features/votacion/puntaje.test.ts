import { describe, expect, it } from 'vitest'
import { AJUSTES_INICIALES, type Calificacion, type Reaccion } from '@/lib/datos'
import { energiaDe, nivelDe, nivelDesdeRms, promedio, reaccionesRestantes, resultadoVotacion } from './puntaje'

const reacciones = (n: number, solicitud_id = 's1', dispositivo_id = 'd1') =>
  Array.from({ length: n }, (_, i) => ({ id: `r${i}`, solicitud_id, dispositivo_id, emoji: '🔥' }) as Reaccion)
const voto = (valor: 1 | 2 | 3, solicitud_id = 's1') => ({ solicitud_id, valor }) as Calificacion

describe('energiaDe y promedio', () => {
  it('llega a 100 con las reacciones configuradas y no pasa de ahí', () => {
    expect(energiaDe(15, 30)).toBe(50)
    expect(energiaDe(90, 30)).toBe(100)
  })

  it('promedia con dos decimales', () => {
    expect(promedio([3, 2, 2])).toBe(2.33)
    expect(promedio([])).toBeNull()
  })
})

describe('resultadoVotacion', () => {
  it('pesa 50% aplausos, 30% calificación y 20% energía', () => {
    // aplausos 80 · calificación 3 → 100 · energía 15/30 → 50
    const r = resultadoVotacion({ id: 's1', aplausos: 80 }, reacciones(15), [voto(3)], AJUSTES_INICIALES)
    expect(r).toEqual({
      aplausos: 80,
      energia: 50,
      calificacion: 3,
      puntaje: Math.round(80 * 0.5 + 100 * 0.3 + 50 * 0.2),
    })
  })

  it('sin micrófono reparte el peso entre calificación y energía', () => {
    // calificación 2 → 67 · energía 30/30 → 100 → (67·30 + 100·20) / 50
    const r = resultadoVotacion({ id: 's1', aplausos: null }, reacciones(30), [voto(2)], AJUSTES_INICIALES)
    expect(r.puntaje).toBe(Math.round((67 * 30 + 100 * 20) / 50))
  })

  it('solo cuenta los votos de esa canción', () => {
    const r = resultadoVotacion(
      { id: 's1', aplausos: null },
      reacciones(5, 'otra'),
      [voto(1, 'otra')],
      AJUSTES_INICIALES,
    )
    expect(r).toEqual({ aplausos: null, energia: null, calificacion: null, puntaje: null })
  })

  it('si hubo reacciones pero nadie calificó, la energía cuenta sola', () => {
    const r = resultadoVotacion({ id: 's1', aplausos: null }, reacciones(3), [], AJUSTES_INICIALES)
    expect(r).toMatchObject({ energia: 10, calificacion: null, puntaje: 10 })
  })
})

describe('niveles y límites', () => {
  it('asigna el nivel por puntaje', () => {
    expect(nivelDe(90).texto).toBe('¡LEYENDA!')
    expect(nivelDe(65).texto).toBe('¡OVACIÓN!')
    expect(nivelDe(40).texto).toBe('¡FUEGO!')
    expect(nivelDe(0).texto).toBe('¡BIEN!')
  })

  it('cuenta las reacciones que le quedan a cada celular', () => {
    const lista = [...reacciones(4, 's1', 'yo'), ...reacciones(9, 's1', 'otro')]
    expect(reaccionesRestantes(lista, 's1', 'yo', 10)).toBe(6)
    expect(reaccionesRestantes(lista, 's2', 'yo', 10)).toBe(10)
  })

  it('convierte el volumen del micrófono a 0–100', () => {
    expect(nivelDesdeRms(0)).toBe(0)
    expect(nivelDesdeRms(10 ** (-50 / 20))).toBe(0)
    expect(nivelDesdeRms(10 ** (-30 / 20))).toBe(50)
    expect(nivelDesdeRms(1)).toBe(100)
  })
})
