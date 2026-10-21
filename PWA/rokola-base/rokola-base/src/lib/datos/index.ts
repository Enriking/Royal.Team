export type * from './tipos'
export type { Almacen } from './almacen'
export { almacen } from './instancia'
export { useAjustes, useNoche, useTabla } from './hooks'
export {
  AJUSTES_INICIALES,
  ajustesDe,
  enlaceCliente,
  guardarAjustes,
  leerAjustes,
  LIMITES,
  qrApuntaALocal,
  validarAjustes,
} from './ajustes'
export { borrarNoche, borrarTodo } from './mantenimiento'
export { ahoraIso, dispositivoId, nuevoId } from './ids'
export { HORA_CORTE, mesDe, nocheDe, nocheMenos } from './noche'
