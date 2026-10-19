/**
 * Tope "redondo" para el eje de una gráfica de conteos, siempre par para que la marca de la mitad sea entera:
 * 3 → 4, 7 → 8, 13 → 20, 47 → 60, 120 → 200.
 */
export function topeLimpio(maximo: number): number {
  if (maximo <= 2) return 2
  const magnitud = 10 ** Math.floor(Math.log10(maximo))
  const paso = [1, 2, 4, 6, 8, 10].find((p) => p * magnitud >= maximo)!
  return paso * magnitud
}
