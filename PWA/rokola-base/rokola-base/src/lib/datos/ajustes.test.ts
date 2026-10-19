import { describe, expect, it } from 'vitest'
import { AJUSTES_INICIALES, ajustesDe, validarAjustes } from './ajustes'

describe('ajustesDe', () => {
  it('completa con los valores iniciales los campos que falten', () => {
    const guardados = { id: 'bar', nombre_bar: 'Otro bar' } as never
    expect(ajustesDe([guardados])).toMatchObject({ nombre_bar: 'Otro bar', max_pendientes: 1, url_publica: '' })
    expect(ajustesDe([])).toEqual(AJUSTES_INICIALES)
  })
})

describe('validarAjustes', () => {
  it('acepta los valores iniciales', () => {
    expect(validarAjustes(AJUSTES_INICIALES)).toBeNull()
  })

  it('rechaza números fuera de rango, pesos en cero y direcciones raras', () => {
    expect(validarAjustes({ ...AJUSTES_INICIALES, max_pendientes: 0 })).toMatch(/^Canciones en espera por persona/)
    expect(validarAjustes({ ...AJUSTES_INICIALES, minutos_por_turno: 2.5 })).toMatch(/^Minutos por turno/)
    expect(validarAjustes({ ...AJUSTES_INICIALES, peso_aplausos: 0, peso_calificacion: 0, peso_energia: 0 })).toMatch(
      /peso/,
    )
    expect(validarAjustes({ ...AJUSTES_INICIALES, total_mesas: 0 })).toMatch(/^Número de mesas/)
    expect(validarAjustes({ ...AJUSTES_INICIALES, url_publica: 'rokola.mx' })).toMatch(/https/)
    expect(validarAjustes({ ...AJUSTES_INICIALES, url_publica: 'https://rokola.mx' })).toBeNull()
  })
})
