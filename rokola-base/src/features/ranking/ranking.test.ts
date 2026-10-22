import { describe, expect, it } from 'vitest'
import type { Cancion, Solicitud } from '@/lib/datos'
import { estadisticas } from './estadisticas'
import { mejoresActuaciones, salonDeLaFama, topNoche } from './ranking'

let n = 0
const sol = (extra: Partial<Solicitud>): Solicitud =>
  ({
    id: `s${++n}`,
    noche: '2026-10-14',
    cantante_id: 'ana',
    mesa: 1,
    compite: true,
    estado: 'terminada',
    puntaje: 50,
    cerrada_en: `2026-10-15T0${n % 10}:00:00Z`,
    creada_en: '2026-10-15T02:00:00Z',
    cancion_id: null,
    titulo: 'Bamboleo',
    artista: 'Gipsy Kings',
    motivo_rechazo: null,
    aprobada_en: null,
    inicio_en: null,
    ...extra,
  }) as Solicitud

describe('mejoresActuaciones', () => {
  it('deja solo la mejor de cada persona, ordenadas por puntaje', () => {
    const lista = [
      sol({ cantante_id: 'ana', puntaje: 60 }),
      sol({ cantante_id: 'ana', puntaje: 90 }),
      sol({ cantante_id: 'beto', puntaje: 75 }),
    ]
    expect(mejoresActuaciones(lista).map((s) => `${s.cantante_id}${s.puntaje}`)).toEqual(['ana90', 'beto75'])
  })

  it('no incluye a quien no compite, sin puntaje o sin terminar', () => {
    const lista = [
      sol({ compite: false, cantante_id: 'a' }),
      sol({ puntaje: null, cantante_id: 'b' }),
      sol({ estado: 'valorando', cantante_id: 'c' }),
    ]
    expect(mejoresActuaciones(lista)).toEqual([])
  })

  it('en empate gana quien lo logró primero', () => {
    const tarde = sol({ cantante_id: 'tarde', puntaje: 80, cerrada_en: '2026-10-15T03:00:00Z' })
    const temprano = sol({ cantante_id: 'temprano', puntaje: 80, cerrada_en: '2026-10-15T01:00:00Z' })
    expect(mejoresActuaciones([tarde, temprano])[0].cantante_id).toBe('temprano')
  })
})

describe('topNoche y salonDeLaFama', () => {
  it('filtran por noche y por mes', () => {
    const lista = [
      sol({ cantante_id: 'a', noche: '2026-10-14', puntaje: 70 }),
      sol({ cantante_id: 'b', noche: '2026-10-02', puntaje: 95 }),
      sol({ cantante_id: 'c', noche: '2026-09-30', puntaje: 99 }),
    ]
    expect(topNoche(lista, '2026-10-14').map((s) => s.cantante_id)).toEqual(['a'])
    expect(salonDeLaFama(lista, '2026-10').map((s) => s.cantante_id)).toEqual(['b', 'a'])
  })
})

describe('estadisticas', () => {
  it('cuenta pedidos, cantantes, esperas, faltantes y géneros', () => {
    const canciones = [{ id: 'c1', genero: 'Banda' }] as Cancion[]
    const e = estadisticas(
      [
        sol({
          cantante_id: 'a',
          mesa: 1,
          cancion_id: 'c1',
          aprobada_en: '2026-10-15T02:00:00Z',
          inicio_en: '2026-10-15T02:10:00Z',
        }),
        sol({
          cantante_id: 'b',
          mesa: 2,
          cancion_id: 'c1',
          aprobada_en: '2026-10-15T02:00:00Z',
          inicio_en: '2026-10-15T02:20:00Z',
        }),
        sol({ cantante_id: 'c', mesa: 2, titulo: 'Cielito lindo', artista: '', estado: 'rechazada', puntaje: null }),
        sol({
          cantante_id: 'c',
          mesa: 2,
          titulo: 'cielito  lindo',
          artista: '',
          estado: 'en_revision',
          puntaje: null,
        }),
        sol({ cantante_id: 'd', estado: 'cancelada', motivo_rechazo: 'Cancelada por el cliente' }),
      ],
      canciones,
    )
    expect(e).toMatchObject({
      pedidos: 4,
      cantadas: 2,
      rechazadas: 1,
      cantantes: 3,
      mesas: 2,
      esperaPromedio: 15,
      puntajePromedio: 50,
      porGenero: [{ genero: 'Banda', veces: 2 }],
    })
    expect(e.faltantes).toEqual([{ titulo: 'Cielito lindo', artista: '', veces: 2 }])
    expect(e.masPedidas[0]).toMatchObject({ titulo: 'Bamboleo', veces: 2 })
    expect(e.porHora.reduce((suma, h) => suma + h.pedidos, 0)).toBe(4)
  })

  it('sin datos devuelve ceros y listas vacías', () => {
    expect(estadisticas([], [])).toMatchObject({ pedidos: 0, esperaPromedio: null, porHora: [], faltantes: [] })
  })
})
