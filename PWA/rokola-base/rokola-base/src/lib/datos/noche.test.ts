import { describe, expect, it } from 'vitest'
import { mesDe, nocheDe, nocheMenos } from './noche'

describe('nocheDe', () => {
  it('antes de las 6 a.m. cuenta como la noche anterior', () => {
    expect(nocheDe(new Date(2026, 9, 15, 2, 30))).toBe('2026-10-14')
    expect(nocheDe(new Date(2026, 9, 15, 5, 59))).toBe('2026-10-14')
  })

  it('desde las 6 a.m. ya es la noche del día', () => {
    expect(nocheDe(new Date(2026, 9, 15, 6, 0))).toBe('2026-10-15')
    expect(nocheDe(new Date(2026, 9, 15, 23, 0))).toBe('2026-10-15')
  })

  it('cruza meses y años', () => {
    expect(nocheDe(new Date(2027, 0, 1, 1, 0))).toBe('2026-12-31')
  })
})

describe('nocheMenos y mesDe', () => {
  it('resta días cruzando meses', () => {
    expect(nocheMenos('2026-11-01', 1)).toBe('2026-10-31')
    expect(nocheMenos('2026-10-14', 62)).toBe('2026-08-13')
    expect(nocheMenos('2026-10-14', -1)).toBe('2026-10-15')
  })

  it('obtiene el mes', () => {
    expect(mesDe('2026-10-14')).toBe('2026-10')
  })
})
