import { redirect, type LoaderFunctionArgs } from 'react-router'
import { guardarMesa } from '@/features/cola'

/** QR viejos de cada mesa (/m/12): recuerdan esa mesa para el formulario de pedido y llevan a la app. */
export function loader({ params }: LoaderFunctionArgs) {
  const mesa = Number(params.mesa)
  if (Number.isInteger(mesa) && mesa > 0) guardarMesa(mesa)
  return redirect('/m')
}
