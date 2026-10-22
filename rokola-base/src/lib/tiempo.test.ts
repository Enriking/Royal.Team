import { describe, expect, it } from 'vitest'
import { cronometro, haceCuanto } from './tiempo'

describe('haceCuanto', () => {
  const ahora = Date.parse('2026-10-14T23:00:00Z')
  it('redondea a minutos y horas', () => {
    expect(haceCuanto('2026-10-14T22:59:30Z', ahora)).toBe('ahora')
    expect(haceCuanto('2026-10-14T22:55:00Z', ahora)).toBe('hace 5 min')
    expect(haceCuanto('2026-10-14T20:30:00Z', ahora)).toBe('hace 2 h')
  })
})

describe('cronometro', () => {
  it('formatea minutos y segundos', () => {
    expect(cronometro(185_000)).toBe('3:05')
    expect(cronometro(-5)).toBe('0:00')
  })
})
