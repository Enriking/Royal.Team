import { describe, expect, it } from 'vitest'
import type { Cancion, Solicitud } from '@/lib/datos'
import { generos, listasCuradas, masPedidas } from './listas'

const cancion = (id: string, extra: Partial<Cancion> = {}) =>
  ({ id, titulo: `Canción ${id}`, artista: 'X', genero: null, favorita: false, dueto: false, ...extra }) as Cancion
const pedido = (cancion_id: string | null, estado: Solicitud['estado'] = 'terminada') =>
  ({ cancion_id, estado }) as Solicitud

describe('masPedidas', () => {
  it('ordena por veces pedida y no cuenta rechazadas, canceladas ni texto libre', () => {
    const canciones = [cancion('a'), cancion('b'), cancion('c')]
    const solicitudes = [
      pedido('b'),
      pedido('b'),
      pedido('a'),
      pedido('c', 'rechazada'),
      pedido('c', 'cancelada'),
      pedido(null),
    ]
    expect(masPedidas(canciones, solicitudes).map((c) => c.id)).toEqual(['b', 'a'])
  })
})

describe('listasCuradas', () => {
  it('arma solo las listas que tienen canciones', () => {
    const canciones = [
      cancion('a', { favorita: true }),
      cancion('b', { genero: 'Norteño' }),
      cancion('c', { genero: 'Banda sinaloense' }),
      cancion('d', { genero: 'Ranchera' }),
    ]
    const listas = listasCuradas(canciones, [])
    expect(listas.map((l) => l.id)).toEqual(['favoritas', 'regional'])
    expect(listas[1].canciones.map((c) => c.id)).toEqual(['b', 'c'])
  })
})

describe('generos', () => {
  it('cuenta canciones por género', () => {
    const canciones = [cancion('a', { genero: 'Banda' }), cancion('b', { genero: 'Banda' }), cancion('c')]
    expect(generos(canciones)).toEqual([{ genero: 'Banda', total: 2 }])
  })
})
