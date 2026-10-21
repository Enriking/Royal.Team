import { almacen } from './instancia'
import type { Ajustes } from './tipos'

/** Valores con los que arranca el bar (Ajustes en el panel del dueño los cambia). */
export const AJUSTES_INICIALES: Ajustes = {
  id: 'bar',
  nombre_bar: 'Sinatra Canta Bar',
  aceptando: true,
  max_pendientes: 1,
  minutos_por_turno: 4,
  segundos_votacion: 45,
  max_reacciones: 10,
  reacciones_energia_max: 30,
  peso_aplausos: 50,
  peso_calificacion: 30,
  peso_energia: 20,
  total_mesas: 20,
  url_publica: '',
}

/** Enlace que abren los QR: la app del cliente (la mesa se escribe al pedir canción). */
export function enlaceCliente(ajustes: Pick<Ajustes, 'url_publica'>) {
  const base = ajustes.url_publica.trim().replace(/\/+$/, '') || window.location.origin
  return `${base}/m`
}

/** Un QR a "localhost" no abre en los celulares: hay que usar la IP de la red o la dirección pública. */
export function qrApuntaALocal(ajustes: Pick<Ajustes, 'url_publica'>) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(enlaceCliente(ajustes))
}

/** Ajustes guardados completados con los valores iniciales (por si se agregan campos nuevos). */
export function ajustesDe(filas: readonly Ajustes[]): Ajustes {
  return { ...AJUSTES_INICIALES, ...filas[0], id: 'bar' }
}

type Limite = { etiqueta: string; min: number; max: number }

/** Ajustes numéricos: su nombre para mostrar y su rango permitido. */
export const LIMITES = {
  max_pendientes: { etiqueta: 'Canciones en espera por persona', min: 1, max: 5 },
  minutos_por_turno: { etiqueta: 'Minutos por turno', min: 1, max: 15 },
  segundos_votacion: { etiqueta: 'Segundos para votar', min: 10, max: 300 },
  max_reacciones: { etiqueta: 'Reacciones por celular', min: 1, max: 50 },
  reacciones_energia_max: { etiqueta: 'Reacciones para energía máxima', min: 1, max: 500 },
  peso_aplausos: { etiqueta: 'Peso de los aplausos', min: 0, max: 100 },
  peso_calificacion: { etiqueta: 'Peso de la calificación', min: 0, max: 100 },
  peso_energia: { etiqueta: 'Peso de la energía', min: 0, max: 100 },
  total_mesas: { etiqueta: 'Número de mesas', min: 1, max: 200 },
} satisfies Partial<Record<keyof Ajustes, Limite>>

/** Revisa los ajustes antes de guardarlos. Devuelve el error para mostrar, o null. */
export function validarAjustes(a: Ajustes): string | null {
  if (!a.nombre_bar.trim()) return 'Escribe el nombre del bar.'
  for (const [campo, { etiqueta, min, max }] of Object.entries(LIMITES)) {
    const valor = a[campo as keyof typeof LIMITES]
    if (!Number.isInteger(valor) || valor < min || valor > max) {
      return `${etiqueta}: debe ser un número entero entre ${min} y ${max}.`
    }
  }
  if (a.peso_aplausos + a.peso_calificacion + a.peso_energia === 0)
    return 'Al menos un peso del puntaje debe ser mayor a 0.'
  if (a.url_publica.trim() && !/^https?:\/\/[^\s/]+/.test(a.url_publica.trim())) {
    return 'La dirección pública debe empezar con https:// (o http://).'
  }
  return null
}

export function leerAjustes(): Ajustes {
  return ajustesDe(almacen.filas('ajustes'))
}

export function guardarAjustes(cambios: Partial<Omit<Ajustes, 'id'>>) {
  return almacen.guardar('ajustes', [{ ...leerAjustes(), ...cambios }])
}
