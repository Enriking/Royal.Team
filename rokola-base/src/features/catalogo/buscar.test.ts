import { describe, expect, it } from 'vitest'
import type { Cancion } from '@/lib/datos'
import { buscar, distancia, indexar, normalizar } from './buscar'

let n = 0
const cancion = (titulo: string, artista: string, extra: Partial<Cancion> = {}): Cancion => ({
  id: String(++n),
  titulo,
  artista,
  genero: null,
  favorita: false,
  dueto: false,
  archivo: null,
  creada_en: '',
  ...extra,
})

const catalogo = indexar([
  cancion('Bamboleo', 'Gipsy Kings'),
  cancion('El triste', 'José José'),
  cancion('La incondicional', 'Luis Miguel'),
  cancion('La bikina', 'Luis Miguel'),
  cancion('Rayando el sol', 'Maná'),
  cancion('El rey', 'Vicente Fernández'),
  cancion('Cómo me duele', 'Valentín Elizalde'),
  cancion('Volare', 'Gipsy Kings'),
])

const titulos = (consulta: string) => buscar(catalogo, consulta).map((c) => c.titulo)

describe('normalizar', () => {
  it('quita acentos, signos y mayúsculas', () => {
    expect(normalizar('¡Bésame, MUCHO!')).toBe('besame mucho')
    expect(normalizar('Peña  Niño')).toBe('pena nino')
  })
})

describe('distancia', () => {
  it('cuenta inserciones, cambios y letras volteadas', () => {
    expect(distancia('bamboleo', 'bamboleo', 2)).toBe(0)
    expect(distancia('bambolo', 'bamboleo', 2)).toBe(1)
    expect(distancia('bamboelo', 'bamboleo', 2)).toBe(1)
    expect(distancia('xyz', 'bamboleo', 2)).toBe(3)
  })
})

describe('buscar', () => {
  it('encuentra sin acentos ni mayúsculas', () => {
    expect(titulos('MANA')).toEqual(['Rayando el sol'])
    expect(titulos('como me duele')).toEqual(['Cómo me duele'])
  })

  it('perdona errores de dedo', () => {
    expect(titulos('bambolo')).toContain('Bamboleo')
    expect(titulos('incondisional')).toContain('La incondicional')
    expect(titulos('fernandes')).toContain('El rey')
  })

  it('encuentra mientras se escribe', () => {
    expect(titulos('bamb')).toEqual(['Bamboleo'])
    expect(titulos('luis mig')).toEqual(['La bikina', 'La incondicional'])
  })

  it('combina título y artista, y las palabras cortas no estorban', () => {
    expect(titulos('el triste de jose jose')).toEqual(['El triste'])
    expect(titulos('gipsy volare')).toEqual(['Volare'])
  })

  it('pone primero los títulos que empiezan como la búsqueda', () => {
    expect(titulos('el')[0]).toMatch(/^El /)
  })

  it('una búsqueda vacía o sin coincidencias no devuelve nada', () => {
    expect(titulos('   ')).toEqual([])
    expect(titulos('zzzzzz')).toEqual([])
  })
})
