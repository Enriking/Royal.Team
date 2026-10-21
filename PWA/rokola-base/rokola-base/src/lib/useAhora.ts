import { useEffect, useState } from 'react'

/** Hora actual (ms) que se actualiza cada `cadaMs`: para cuentas regresivas y tiempos de espera. */
export function useAhora(cadaMs = 1000) {
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), cadaMs)
    return () => clearInterval(t)
  }, [cadaMs])
  return ahora
}
