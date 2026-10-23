import type { Ajustes, Calificacion, Reaccion, Solicitud } from '@/lib/datos'

export const EMOJIS = ['🔥', '👏', '❤️', '😂', '🎤', '🤘'] as const

export const CALIFICACIONES = [
  { valor: 1, texto: 'Bien' },
  { valor: 2, texto: 'Muy bien' },
  { valor: 3, texto: '¡Increíble!' },
] as const

/** Energía 0–100: cuántas reacciones juntó la canción contra las necesarias para llegar al máximo. */
export function energiaDe(totalReacciones: number, reaccionesMax: number): number {
  return Math.min(100, Math.round((totalReacciones * 100) / Math.max(1, reaccionesMax)))
}

export function promedio(valores: readonly number[]): number | null {
  if (valores.length === 0) return null
  return Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 100) / 100
}

export type Resultado = Pick<Solicitud, 'aplausos' | 'energia' | 'calificacion' | 'puntaje'>

/**
 * Puntaje 0–100 = aplausos, calificación y energía según sus pesos (50/30/20 de inicio).
 * Si falta una parte (p. ej. no hubo micrófono), el resto se reparte su peso.
 * Si nadie participó, no hay puntaje (null) y la canción no entra al ranking.
 */
export function resultadoVotacion(
  solicitud: Pick<Solicitud, 'id' | 'aplausos'>,
  reacciones: readonly Reaccion[],
  calificaciones: readonly Calificacion[],
  ajustes: Ajustes,
): Resultado {
  const totalReacciones = reacciones.filter((r) => r.solicitud_id === solicitud.id).length
  const valores = calificaciones.filter((c) => c.solicitud_id === solicitud.id).map((c) => c.valor)
  const calificacion = promedio(valores)
  const { aplausos } = solicitud
  const nadieParticipo = totalReacciones === 0 && calificacion === null && aplausos === null
  const energia = nadieParticipo ? null : energiaDe(totalReacciones, ajustes.reacciones_energia_max)

  const partes: [number | null, number][] = [
    [aplausos, ajustes.peso_aplausos],
    [calificacion === null ? null : Math.round((calificacion / 3) * 100), ajustes.peso_calificacion],
    [energia, ajustes.peso_energia],
  ]
  const presentes = partes.filter((p): p is [number, number] => p[0] !== null && p[1] > 0)
  const pesoTotal = presentes.reduce((suma, [, peso]) => suma + peso, 0)
  const puntaje =
    pesoTotal === 0 ? null : Math.round(presentes.reduce((suma, [valor, peso]) => suma + valor * peso, 0) / pesoTotal)

  return { aplausos, energia, calificacion, puntaje }
}

export type Nivel = { texto: string; desde: number }

/** Niveles que se muestran en la pantalla del bar. */
export const NIVELES: Nivel[] = [
  { texto: '¡LEYENDA!', desde: 85 },
  { texto: '¡OVACIÓN!', desde: 65 },
  { texto: '¡FUEGO!', desde: 40 },
  { texto: '¡BIEN!', desde: 0 },
]

export function nivelDe(valor: number): Nivel {
  return NIVELES.find((n) => valor >= n.desde) ?? NIVELES.at(-1)!
}

/** Reacciones que todavía puede mandar este celular a esta canción. */
export function reaccionesRestantes(
  reacciones: readonly Reaccion[],
  solicitudId: string,
  dispositivoId: string,
  maximo: number,
): number {
  const usadas = reacciones.filter((r) => r.solicitud_id === solicitudId && r.dispositivo_id === dispositivoId).length
  return Math.max(0, maximo - usadas)
}

/** Nivel 0–100 desde el volumen (RMS 0–1) del micrófono. `piso` es el ruido normal del bar en dBFS; `piso + 40` es una ovación. */
export function nivelDesdeRms(rms: number, piso = -50): number {
  if (rms <= 0) return 0
  const db = 20 * Math.log10(rms)
  return Math.min(100, Math.max(0, Math.round(((db - piso) / 40) * 100)))
}
