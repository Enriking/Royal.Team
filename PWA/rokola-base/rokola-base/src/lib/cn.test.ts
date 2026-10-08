import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('ignora valores vacíos', () => {
    expect(cn('px-4', false, null, undefined, 'py-2')).toBe('px-4 py-2')
  })

  it('en clases que chocan, gana la última', () => {
    expect(cn('h-12 px-5', 'h-14')).toBe('px-5 h-14')
  })

  it('distingue la escala tipográfica propia de los colores', () => {
    expect(cn('text-title-1', 'text-lava')).toBe('text-title-1 text-lava')
    expect(cn('text-title-1 text-lava', 'text-caption')).toBe('text-lava text-caption')
  })

  it('reconoce radios, sombras y degradados propios', () => {
    expect(cn('rounded-card', 'rounded-field')).toBe('rounded-field')
    expect(cn('shadow-card', 'shadow-glow')).toBe('shadow-glow')
    expect(cn('bg-surface', 'bg-gradient-black-orange')).toBe('bg-surface bg-gradient-black-orange')
  })
})
