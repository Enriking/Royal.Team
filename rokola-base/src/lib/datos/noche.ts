/** Hora en la que empieza una noche nueva: lo que pasa a las 2 a.m. cuenta para la noche anterior. */
export const HORA_CORTE = 6

const dos = (n: number) => String(n).padStart(2, '0')

/** Noche del bar a la que pertenece una fecha, como 'AAAA-MM-DD' (hora local). */
export function nocheDe(fecha: Date = new Date()): string {
  const d = new Date(fecha.getTime() - HORA_CORTE * 3_600_000)
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`
}

/** Mes ('AAAA-MM') de una noche. */
export function mesDe(noche: string): string {
  return noche.slice(0, 7)
}

/** Noche que queda `dias` antes (o después, si es negativo) de otra. */
export function nocheMenos(noche: string, dias: number): string {
  const [a, m, d] = noche.split('-').map(Number)
  const fecha = new Date(a, m - 1, d - dias, 12)
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`
}
