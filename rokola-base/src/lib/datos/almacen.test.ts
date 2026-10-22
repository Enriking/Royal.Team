import { describe, expect, it, vi } from 'vitest'
import { AlmacenLocal, DiscoMemoria } from './almacen'
import type { Reaccion } from './tipos'

const reaccion = (id: string, emoji = '🔥'): Reaccion => ({
  id,
  noche: '2026-10-14',
  solicitud_id: 's1',
  dispositivo_id: 'd1',
  emoji,
  creada_en: '2026-10-14T22:00:00.000Z',
})

describe('AlmacenLocal', () => {
  it('guarda, reemplaza por id y borra', async () => {
    const almacen = new AlmacenLocal(new DiscoMemoria())
    await almacen.guardar('reacciones', [reaccion('a'), reaccion('b')])
    await almacen.guardar('reacciones', [reaccion('a', '👏'), reaccion('c')])
    expect(almacen.filas('reacciones').map((r) => `${r.id}${r.emoji}`)).toEqual(['a👏', 'b🔥', 'c🔥'])

    await almacen.borrar('reacciones', ['b'])
    expect(almacen.filas('reacciones').map((r) => r.id)).toEqual(['a', 'c'])
  })

  it('devuelve la misma referencia mientras la tabla no cambie', async () => {
    const almacen = new AlmacenLocal(new DiscoMemoria())
    await almacen.guardar('reacciones', [reaccion('a')])
    expect(almacen.filas('reacciones')).toBe(almacen.filas('reacciones'))
  })

  it('actualiza solo si la fila conserva los valores de `si`', async () => {
    const almacen = new AlmacenLocal(new DiscoMemoria())
    await almacen.guardar('reacciones', [reaccion('a')])
    expect(await almacen.actualizar('reacciones', 'a', { emoji: '❤️' }, { emoji: '👏' })).toBe(false)
    expect(await almacen.actualizar('reacciones', 'a', { emoji: '❤️' }, { emoji: '🔥' })).toBe(true)
    expect(almacen.filas('reacciones')[0].emoji).toBe('❤️')
  })

  it('no pierde lo que escribió otra pestaña', async () => {
    const disco = new DiscoMemoria()
    const pestanaA = new AlmacenLocal(disco)
    const pestanaB = new AlmacenLocal(disco)
    pestanaA.filas('reacciones') // A ya tiene la tabla en memoria
    await pestanaB.guardar('reacciones', [reaccion('b')])
    await pestanaA.guardar('reacciones', [reaccion('a')])
    expect(pestanaA.filas('reacciones').map((r) => r.id)).toEqual(['b', 'a'])
  })

  it('avisa a los suscriptores en cambios propios y externos', async () => {
    const disco = new DiscoMemoria()
    const almacen = new AlmacenLocal(disco)
    const aviso = vi.fn<() => void>()
    const dejar = almacen.suscribir('reacciones', aviso)

    await almacen.guardar('reacciones', [reaccion('a')])
    expect(aviso).toHaveBeenCalledTimes(1)

    disco.setItem('rokola:v1:reacciones', JSON.stringify([reaccion('z')]))
    almacen.recibirCambioExterno('rokola:v1:reacciones')
    expect(aviso).toHaveBeenCalledTimes(2)
    expect(almacen.filas('reacciones').map((r) => r.id)).toEqual(['z'])

    almacen.recibirCambioExterno('otra-app:clave')
    dejar()
    await almacen.guardar('reacciones', [reaccion('b')])
    expect(aviso).toHaveBeenCalledTimes(2)
  })

  it('trata datos dañados como tabla vacía', () => {
    const disco = new DiscoMemoria()
    disco.setItem('rokola:v1:reacciones', '{no es json')
    expect(new AlmacenLocal(disco).filas('reacciones')).toEqual([])
  })
})
