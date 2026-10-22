import { useMemo } from 'react'
import { encode } from 'uqr'

/** Código QR (negro sobre blanco, con margen, para que cualquier cámara lo lea). Se dibuja como SVG nítido al imprimir. */
export function Qr({ valor, className, titulo }: { valor: string; className?: string; titulo?: string }) {
  const src = useMemo(() => {
    const { data, size } = encode(valor, { ecc: 'M', border: 2 })
    let trazo = ''
    data.forEach((fila, y) =>
      fila.forEach((negro, x) => {
        if (negro) trazo += `M${x} ${y}h1v1h-1z`
      }),
    )
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
      `<rect width="${size}" height="${size}" fill="#fff"/><path d="${trazo}" fill="#000"/></svg>`
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }, [valor])

  return <img src={src} alt={titulo ?? `Código QR: ${valor}`} className={className} draggable={false} />
}
