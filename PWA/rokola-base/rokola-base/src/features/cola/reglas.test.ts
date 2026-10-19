import { describe, expect, it } from 'vitest'
import { AJUSTES_INICIALES, type Solicitud } from '@/lib/datos'
import {
  armarFila,
  esperaEstimada,
  intercambio,
  limpiarIniciales,
  mismaCancionHoy,
  puedePedir,
  rondaPara,
  rondaPrevista,
  siguienteOrden,
  turnosAntes,
  validarPedido,
  type DatosPedido,
} from './reglas'

let n = 0
const sol = (extra: Partial<Solicitud>): Solicitud =>
  ({
    id: `s${++n}`,
    cantante_id: 'ana',
    estado: 'aprobada',
    ronda: 1,
    orden: n,
    creada_en: `2026-10-14T22:${String(n).padStart(2, '0')}:00Z`,
    cancion_id: null,
    titulo: 'Bamboleo',
    artista: 'Gipsy Kings',
    ...extra,
  }) as Solicitud

describe('rondaPara', () => {
  it('cuenta solo las canciones que el DJ ya aprobó de esa persona', () => {
    const noche = [
      sol({ cantante_id: 'ana', estado: 'terminada' }),
      sol({ cantante_id: 'ana', estado: 'aprobada' }),
      sol({ cantante_id: 'ana', estado: 'rechazada' }),
      sol({ cantante_id: 'ana', estado: 'cancelada' }),
      sol({ cantante_id: 'beto', estado: 'terminada' }),
    ]
    expect(rondaPara(noche, 'ana')).toBe(3)
    expect(rondaPara(noche, 'beto')).toBe(2)
    expect(rondaPara(noche, 'carla')).toBe(1)
  })

  it('la ronda prevista cuenta las anteriores que siguen en revisión', () => {
    const primera = sol({ cantante_id: 'rocio', estado: 'en_revision', creada_en: '2026-10-14T22:00:00Z' })
    const segunda = sol({ cantante_id: 'rocio', estado: 'en_revision', creada_en: '2026-10-14T22:01:00Z' })
    expect(rondaPrevista([primera, segunda], primera)).toBe(1)
    expect(rondaPrevista([primera, segunda], segunda)).toBe(2)
  })

  it('no se cuenta a sí misma al reaprobar', () => {
    const s = sol({ cantante_id: 'ana', estado: 'aprobada' })
    expect(rondaPara([s], 'ana', s.id)).toBe(1)
  })
})

describe('fila justa', () => {
  it('quien llega tarde con su primera canción pasa antes que la segunda ronda', () => {
    const anaSegunda = sol({ cantante_id: 'ana', ronda: 2, orden: 100 })
    const betoPrimera = sol({ cantante_id: 'beto', ronda: 1, orden: 200 })
    const carlaPrimera = sol({ cantante_id: 'carla', ronda: 1, orden: 150 })
    const fila = armarFila([anaSegunda, betoPrimera, carlaPrimera])
    expect(fila.enEspera.map((s) => s.cantante_id)).toEqual(['carla', 'beto', 'ana'])
  })

  it('separa escenario, votación, llamada, fila y revisión', () => {
    const fila = armarFila([
      sol({ estado: 'cantando', inicio_en: '2026-10-14T23:00:00Z' }),
      sol({ estado: 'valorando', fin_en: '2026-10-14T22:55:00Z' }),
      sol({ estado: 'llamada' }),
      sol({ estado: 'en_revision', creada_en: '2026-10-14T23:05:00Z', id: 'tarde' }),
      sol({ estado: 'en_revision', creada_en: '2026-10-14T23:01:00Z', id: 'temprano' }),
      sol({ estado: 'terminada' }),
    ])
    expect(fila.cantando?.estado).toBe('cantando')
    expect(fila.valorando?.estado).toBe('valorando')
    expect(fila.llamada?.estado).toBe('llamada')
    expect(fila.enEspera).toEqual([])
    expect(fila.enRevision.map((s) => s.id)).toEqual(['temprano', 'tarde'])
  })
})

describe('turnos y espera', () => {
  it('cuenta a la persona llamada como un turno antes', () => {
    const llamada = sol({ estado: 'llamada' })
    const a = sol({ orden: 1 })
    const b = sol({ orden: 2 })
    const fila = armarFila([llamada, a, b])
    expect(turnosAntes(fila, llamada.id)).toBe(0)
    expect(turnosAntes(fila, a.id)).toBe(1)
    expect(turnosAntes(fila, b.id)).toBe(2)
    expect(turnosAntes(fila, 'otra')).toBeNull()
  })

  it('estima minutos con media canción si alguien está cantando', () => {
    expect(esperaEstimada(2, true, 4)).toBe(10)
    expect(esperaEstimada(0, false, 4)).toBe(0)
  })
})

describe('intercambio', () => {
  it('sube un turno intercambiando ronda y orden con el de arriba', () => {
    const a = sol({ ronda: 1, orden: 10 })
    const b = sol({ ronda: 2, orden: 5 })
    expect(intercambio([a, b], b.id, 'subir')).toEqual([
      { id: b.id, ronda: 1, orden: 10 },
      { id: a.id, ronda: 2, orden: 5 },
    ])
  })

  it('no hace nada en las orillas', () => {
    const a = sol({})
    expect(intercambio([a], a.id, 'subir')).toBeNull()
    expect(intercambio([a], a.id, 'bajar')).toBeNull()
  })
})

describe('siguienteOrden', () => {
  it('siempre queda después de todos', () => {
    expect(siguienteOrden([sol({ orden: 5000 })], 1000)).toBe(5001)
    expect(siguienteOrden([], 1000)).toBe(1000)
  })
})

describe('puedePedir', () => {
  it('limita las canciones pendientes por persona', () => {
    const noche = [sol({ cantante_id: 'ana', estado: 'en_revision' }), sol({ cantante_id: 'ana', estado: 'terminada' })]
    expect(puedePedir(noche, 'ana', AJUSTES_INICIALES).ok).toBe(false)
    expect(puedePedir(noche, 'beto', AJUSTES_INICIALES).ok).toBe(true)
    expect(puedePedir(noche, 'ana', { ...AJUSTES_INICIALES, max_pendientes: 2 }).ok).toBe(true)
  })

  it('no deja pedir si la fila está cerrada', () => {
    expect(puedePedir([], 'ana', { ...AJUSTES_INICIALES, aceptando: false })).toMatchObject({ ok: false })
  })
})

describe('mismaCancionHoy', () => {
  it('encuentra la misma canción pedida por otros, sin contar rechazadas', () => {
    const a = sol({ cancion_id: 'c1' })
    const b = sol({ cancion_id: 'c1', estado: 'terminada' })
    const c = sol({ cancion_id: 'c1', estado: 'rechazada' })
    const libre1 = sol({ titulo: 'Cielito lindo', artista: '' })
    const libre2 = sol({ titulo: 'CIELITO LINDO', artista: '' })
    expect(mismaCancionHoy([a, b, c], a)).toEqual([b])
    expect(mismaCancionHoy([libre1, libre2], libre1)).toEqual([libre2])
  })
})

describe('pedido', () => {
  const datos: DatosPedido = {
    mesa: 12,
    cantante_id: 'ana',
    nombre: 'Lupita',
    iniciales: 'lup',
    cancion_id: null,
    titulo: 'Bamboleo',
    artista: '',
    dueto_con: null,
    nota: null,
    compite: true,
  }

  it('limpia las iniciales a 3 letras sin acentos', () => {
    expect(limpiarIniciales('ñoño')).toBe('NON')
    expect(limpiarIniciales('J. R. 2')).toBe('JR')
  })

  it('valida nombre, iniciales, canción y mesa', () => {
    expect(validarPedido(datos, 20)).toBeNull()
    expect(validarPedido({ ...datos, nombre: ' ' }, 20)).toMatch(/nombre/)
    expect(validarPedido({ ...datos, iniciales: 'LU' }, 20)).toMatch(/3 letras/)
    expect(validarPedido({ ...datos, titulo: '' }, 20)).toMatch(/canción/)
    expect(validarPedido({ ...datos, mesa: 0 }, 20)).toMatch(/del 1 al 20/)
    expect(validarPedido({ ...datos, mesa: 21 }, 20)).toMatch(/mesa/)
    expect(validarPedido({ ...datos, mesa: Number.NaN }, 20)).toMatch(/mesa/)
  })
})
