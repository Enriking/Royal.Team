const CLAVE = 'rokola:mesa'

/** Última mesa que se escribió en este celular (para no volver a pedirla en cada canción). */
export function mesaGuardada(): number | null {
  try {
    const mesa = Number(localStorage.getItem(CLAVE))
    return Number.isInteger(mesa) && mesa > 0 ? mesa : null
  } catch {
    return null
  }
}

export function guardarMesa(mesa: number) {
  try {
    localStorage.setItem(CLAVE, String(mesa))
  } catch {
    // sin almacenamiento: no pasa nada
  }
}
