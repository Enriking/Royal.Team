/** "ahora", "hace 5 min", "hace 2 h". */
export function haceCuanto(iso: string, ahora = Date.now()): string {
  const minutos = Math.floor((ahora - new Date(iso).getTime()) / 60_000)
  if (minutos < 1) return 'ahora'
  if (minutos < 60) return `hace ${minutos} min`
  return `hace ${Math.floor(minutos / 60)} h`
}

/** Duración como cronómetro: 185000 → "3:05". */
export function cronometro(ms: number): string {
  const segundos = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`
}

/** Hora corta local: "22:05". */
export function horaCorta(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
}
