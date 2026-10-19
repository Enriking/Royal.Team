import { useCallback, useEffect, useRef, useState } from 'react'
import type { Solicitud } from '@/lib/datos'
import { registrarAplausos } from './api'
import { nivelDesdeRms } from './puntaje'

export type EstadoMicro = 'apagado' | 'pidiendo' | 'activo' | 'error'

/** Ruido normal del bar (dBFS) según la sensibilidad: con más sensibilidad, menos aplauso llena el medidor. */
export const SENSIBILIDADES = { baja: -40, media: -50, alta: -60 } as const
export type Sensibilidad = keyof typeof SENSIBILIDADES

/** Aplausómetro con el micrófono del dispositivo (Web Audio API). Nivel 0–100 suavizado como un vúmetro. */
export function useAplausometro(sensibilidad: Sensibilidad) {
  const [estado, setEstado] = useState<EstadoMicro>('apagado')
  const [error, setError] = useState<string | null>(null)
  const [nivel, setNivel] = useState(0)
  const piso = useRef<number>(SENSIBILIDADES[sensibilidad])
  const apagar = useRef<(() => void) | null>(null)

  useEffect(() => {
    piso.current = SENSIBILIDADES[sensibilidad]
  }, [sensibilidad])

  const detener = useCallback(() => {
    apagar.current?.()
    apagar.current = null
    setEstado('apagado')
    setNivel(0)
  }, [])

  const iniciar = useCallback(async () => {
    if (apagar.current) return
    if (!navigator.mediaDevices?.getUserMedia) {
      setEstado('error')
      setError('Este navegador no deja usar el micrófono aquí. Abre la pantalla desde localhost o con https.')
      return
    }
    setEstado('pidiendo')
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const ctx = new AudioContext()
      const analizador = ctx.createAnalyser()
      analizador.fftSize = 2048
      ctx.createMediaStreamSource(stream).connect(analizador)
      const muestras = new Float32Array(analizador.fftSize)
      let suavizado = 0
      let ultimo = 0
      let cuadro = 0

      const medir = (t: number) => {
        analizador.getFloatTimeDomainData(muestras)
        let suma = 0
        for (const m of muestras) suma += m * m
        const actual = nivelDesdeRms(Math.sqrt(suma / muestras.length), piso.current)
        // Sube rápido y baja lento, como la aguja de un vúmetro
        suavizado = actual > suavizado ? suavizado * 0.6 + actual * 0.4 : suavizado * 0.95 + actual * 0.05
        if (t - ultimo > 80) {
          ultimo = t
          setNivel(Math.round(suavizado))
        }
        cuadro = requestAnimationFrame(medir)
      }
      cuadro = requestAnimationFrame(medir)

      apagar.current = () => {
        cancelAnimationFrame(cuadro)
        stream.getTracks().forEach((pista) => pista.stop())
        void ctx.close()
      }
      setEstado('activo')
    } catch (e) {
      setEstado('error')
      setError(
        e instanceof DOMException && e.name === 'NotAllowedError'
          ? 'Se negó el permiso del micrófono. Actívalo en el candado de la barra de direcciones.'
          : 'No se pudo abrir el micrófono.',
      )
    }
  }, [])

  useEffect(() => () => apagar.current?.(), [])

  return { estado, error, nivel, iniciar, detener }
}

/** Mientras una canción está en votación, guarda el pico del aplausómetro en su solicitud. */
export function useRegistrarAplausos(valorando: Solicitud | null, nivel: number, activo: boolean) {
  const pico = useRef<{ id: string; valor: number } | null>(null)
  useEffect(() => {
    if (!valorando || !activo) return
    if (pico.current?.id !== valorando.id) pico.current = { id: valorando.id, valor: valorando.aplausos ?? 0 }
    // Se guarda cada 3 puntos de subida (y el 100) para no escribir en cada cuadro
    if (nivel >= pico.current.valor + 3 || (nivel === 100 && pico.current.valor < 100)) {
      pico.current.valor = nivel
      void registrarAplausos(valorando.id, nivel)
    }
  }, [valorando, nivel, activo])
}
