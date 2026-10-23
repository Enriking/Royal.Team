/**
 * Id único (UUID v4). `crypto.randomUUID` solo existe en sitios seguros (https o localhost);
 * al probar desde un celular por la IP de la red local no está, así que se arma a mano.
 */
export function nuevoId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

const CLAVE_DISPOSITIVO = 'rokola:dispositivo'
let dispositivo: string | undefined

/** Id fijo de este celular (para limitar un voto y 10 reacciones por canción). */
export function dispositivoId(): string {
  if (dispositivo) return dispositivo
  try {
    dispositivo = localStorage.getItem(CLAVE_DISPOSITIVO) ?? undefined
    if (!dispositivo) {
      dispositivo = nuevoId()
      localStorage.setItem(CLAVE_DISPOSITIVO, dispositivo)
    }
  } catch {
    dispositivo ??= nuevoId() // almacenamiento bloqueado: dura mientras la pestaña esté abierta
  }
  return dispositivo
}

export const ahoraIso = () => new Date().toISOString()
