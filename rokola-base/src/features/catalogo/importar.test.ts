import { describe, expect, it } from 'vitest'
import type { Cancion } from '@/lib/datos'
import { carpetaDe, esArchivoDeMusica, parsearArchivo, parsearTexto, sinRepetidas } from './importar'

describe('parsearArchivo', () => {
  it('lee "Artista - Título" y limpia extensión, pista y etiquetas', () => {
    expect(parsearArchivo('Karaoke/01 - Maná - Rayando el sol (Karaoke).mp3')).toEqual({
      artista: 'Maná',
      titulo: 'Rayando el sol',
      archivo: '01 - Maná - Rayando el sol (Karaoke).mp3',
    })
    expect(parsearArchivo('SF045-07 Queen - Bohemian Rhapsody [Karaoke Version].cdg')).toMatchObject({
      artista: 'Queen',
      titulo: 'Bohemian Rhapsody',
    })
    expect(parsearArchivo('Los_Angeles_Azules_-_17_años.mp4')).toMatchObject({
      artista: 'Los Angeles Azules',
      titulo: '17 años',
    })
  })

  it('respeta títulos con guiones y lee "Título - Artista" si se pide', () => {
    expect(parsearArchivo('Gipsy Kings - Bamboleo - En vivo.mp3')).toMatchObject({
      artista: 'Gipsy Kings',
      titulo: 'Bamboleo - En vivo',
    })
    expect(parsearArchivo('El triste - José José.mp3', true)).toMatchObject({
      titulo: 'El triste',
      artista: 'José José',
    })
    expect(parsearArchivo('Caifanes-Afuera.mp3')).toMatchObject({ artista: 'Caifanes', titulo: 'Afuera' })
  })

  it('sin separador, todo es el título', () => {
    expect(parsearArchivo('Cielito lindo.mp3')).toMatchObject({ titulo: 'Cielito lindo', artista: '' })
  })
})

describe('parsearTexto', () => {
  it('acepta renglones "Artista - Título" y columnas de hoja de cálculo', () => {
    const texto =
      'Título\tArtista\tGénero\nEl rey\tVicente Fernández\tRanchera\n\nManá - Oye mi amor\nAC/DC - Thunderstruck'
    expect(parsearTexto(texto)).toEqual([
      { titulo: 'El rey', artista: 'Vicente Fernández', genero: 'Ranchera' },
      { titulo: 'Oye mi amor', artista: 'Maná' },
      { titulo: 'Thunderstruck', artista: 'AC/DC' },
    ])
  })
})

describe('archivos y carpetas', () => {
  it('reconoce formatos de karaoke', () => {
    expect(esArchivoDeMusica('a.MP3')).toBe(true)
    expect(esArchivoDeMusica('a.cdg')).toBe(true)
    expect(esArchivoDeMusica('portada.jpg')).toBe(false)
  })

  it('usa la carpeta contenedora como género', () => {
    expect(carpetaDe('Karaoke/Banda/x.mp3')).toBe('Banda')
    expect(carpetaDe('Karaoke/x.mp3')).toBeNull()
  })
})

describe('sinRepetidas', () => {
  it('salta las que ya están (sin importar acentos) y las repetidas en el lote', () => {
    const existente = { titulo: 'Rayando el sol', artista: 'Maná' } as Cancion
    const nuevas = sinRepetidas(
      [existente],
      [
        { titulo: 'rayando el sol', artista: 'Mana' },
        { titulo: 'Afuera', artista: 'Caifanes', archivo: 'Caifanes - Afuera.mp3' },
        { titulo: 'Afuera', artista: 'Caifanes', archivo: 'Caifanes - Afuera.cdg' },
        { titulo: '  ', artista: 'Nadie' },
      ],
    )
    expect(nuevas).toHaveLength(1)
    expect(nuevas[0]).toMatchObject({ titulo: 'Afuera', artista: 'Caifanes', favorita: false, genero: null })
    expect(nuevas[0].id).toMatch(/^[0-9a-f-]{36}$/)
  })
})
