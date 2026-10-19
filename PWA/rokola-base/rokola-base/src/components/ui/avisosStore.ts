/** Avisos breves (toasts). Se muestran con <Avisos />, que vive en main.tsx. */
export type Aviso = { id: number; texto: string; tipo: 'ok' | 'error' }

let avisos: Aviso[] = []
let siguienteId = 0
const oyentes = new Set<() => void>()
const emitir = () => oyentes.forEach((o) => o())

export function avisar(texto: string, tipo: Aviso['tipo'] = 'ok') {
  const id = ++siguienteId
  avisos = [...avisos.slice(-2), { id, texto, tipo }]
  emitir()
  setTimeout(() => {
    avisos = avisos.filter((a) => a.id !== id)
    emitir()
  }, 3500)
}

/** Ejecuta una acción; si falla muestra el error, si sale bien y hay `exito`, lo avisa. Devuelve si salió bien. */
export async function conAviso(accion: () => Promise<unknown>, exito?: string) {
  try {
    await accion()
    if (exito) avisar(exito)
    return true
  } catch (error) {
    avisar(error instanceof Error ? error.message : 'Algo salió mal, vuelve a intentarlo.', 'error')
    return false
  }
}

export const avisosStore = {
  suscribir(oyente: () => void) {
    oyentes.add(oyente)
    return () => {
      oyentes.delete(oyente)
    }
  },
  leer: () => avisos,
}
