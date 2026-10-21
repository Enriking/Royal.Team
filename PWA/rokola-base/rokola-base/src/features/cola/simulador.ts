import { almacen, leerAjustes, nocheDe, nuevoId, type Solicitud } from '@/lib/datos'
import { limpiarIniciales } from './reglas'

const NOMBRES = ['Lupita', 'Mario', 'José', 'Carla', 'Beto', 'Ana', 'Diego', 'Sofía', 'Toño', 'Paty', 'Memo', 'Rocío']
const NOTAS = [null, null, null, 'Es mi cumpleaños 🎂', 'Primera vez que canto', 'Va dedicada a la mesa 3']

const alAzar = <T>(lista: readonly T[]) => lista[Math.floor(Math.random() * lista.length)]

/**
 * Solo para probar: crea solicitudes de personas ficticias (desde otros "celulares") con canciones del catálogo.
 * Así se puede ver la bandeja y la fila sin tener varios teléfonos.
 */
export async function simularPedidos(cuantos = 5) {
  const canciones = almacen.filas('canciones')
  const { total_mesas } = leerAjustes()
  const noche = nocheDe()
  const nuevas: Solicitud[] = Array.from({ length: cuantos }, (_, i) => {
    const nombre = alAzar(NOMBRES)
    const cancion = canciones.length ? alAzar(canciones) : null
    return {
      id: nuevoId(),
      noche,
      creada_en: new Date(Date.now() + i).toISOString(),
      mesa: 1 + Math.floor(Math.random() * total_mesas),
      dispositivo_id: `simulado-${nombre}`,
      cantante_id: `simulado-${nombre}`,
      nombre,
      iniciales: limpiarIniciales(nombre),
      cancion_id: cancion?.id ?? null,
      titulo: cancion?.titulo ?? 'Cielito lindo',
      artista: cancion?.artista ?? 'Tradicional',
      dueto_con: Math.random() < 0.15 ? alAzar(NOMBRES) : null,
      nota: alAzar(NOTAS),
      compite: Math.random() < 0.8,
      estado: 'en_revision',
      motivo_rechazo: null,
      ronda: null,
      orden: null,
      aprobada_en: null,
      llamada_en: null,
      inicio_en: null,
      fin_en: null,
      cerrada_en: null,
      aplausos: null,
      energia: null,
      calificacion: null,
      puntaje: null,
    }
  })
  await almacen.guardar('solicitudes', nuevas)
}
