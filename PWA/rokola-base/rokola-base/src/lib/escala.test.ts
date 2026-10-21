import { describe, expect, it } from 'vitest'
import { topeLimpio } from './escala'

describe('topeLimpio', () => {
  it('redondea hacia arriba a un número par y limpio', () => {
    expect([0, 1, 2, 3, 7, 10, 13, 47, 120].map(topeLimpio)).toEqual([2, 2, 2, 4, 8, 10, 20, 60, 200])
  })
})
