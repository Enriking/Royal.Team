import { useState } from 'react'
import { SENSIBILIDADES, useAplausometro, type Sensibilidad } from '@/features/votacion'

const CLAVE = 'rokola:sensibilidad'

function leerSensibilidad(): Sensibilidad {
  try {
    const guardada = localStorage.getItem(CLAVE)
    return guardada && guardada in SENSIBILIDADES ? (guardada as Sensibilidad) : 'media'
  } catch {
    return 'media'
  }
}

/** Aplausómetro de la pantalla con su sensibilidad guardada en este dispositivo. */
export function useAplausometroPantalla() {
  const [sensibilidad, setSensibilidad] = useState(leerSensibilidad)
  const micro = useAplausometro(sensibilidad)
  const cambiarSensibilidad = (s: Sensibilidad) => {
    setSensibilidad(s)
    try {
      localStorage.setItem(CLAVE, s)
    } catch {
      // sin almacenamiento: dura mientras la pestaña esté abierta
    }
  }
  return { micro, sensibilidad, cambiarSensibilidad }
}
