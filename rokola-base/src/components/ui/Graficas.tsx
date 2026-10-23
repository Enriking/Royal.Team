import { useState } from 'react'
import { topeLimpio } from '@/lib/escala'

export type Dato = { etiqueta: string; valor: number }

/** Tabla equivalente a una gráfica (para leer los números sin depender del color ni del mouse). */
function TablaDatos({ datos, columna, unidad }: { datos: Dato[]; columna: string; unidad: string }) {
  return (
    <details className="text-caption text-grey">
      <summary className="cursor-pointer select-none hover:text-offwhite">Ver como tabla</summary>
      <table className="mt-2 w-full text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="py-1 font-medium">{columna}</th>
            <th className="py-1 text-right font-medium">{unidad}</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => (
            <tr key={d.etiqueta} className="border-b border-line/50 text-offwhite">
              <td className="py-1">{d.etiqueta}</td>
              <td className="py-1 text-right tabular-nums">{d.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}

/**
 * Columnas verticales de una sola serie (p. ej. pedidos por hora).
 * Columnas finas con punta redondeada, ejes tenues, tooltip al pasar el mouse o con el teclado, y su tabla.
 */
export function Columnas({ datos, columna, unidad }: { datos: Dato[]; columna: string; unidad: string }) {
  const [activo, setActivo] = useState<number | null>(null)
  const tope = topeLimpio(Math.max(0, ...datos.map((d) => d.valor)))
  const cadaCuanto = Math.ceil(datos.length / 8) // no más de ~8 etiquetas en el eje

  return (
    <figure className="space-y-3">
      <div className="flex gap-2">
        <div className="flex h-44 flex-col justify-between text-right text-caption text-grey tabular-nums">
          <span className="-translate-y-1/2">{tope}</span>
          <span>{tope / 2}</span>
          <span className="translate-y-1/2">0</span>
        </div>
        <div className="relative h-44 flex-1">
          {[0, 50, 100].map((p) => (
            <span key={p} className="absolute inset-x-0 h-px bg-line" style={{ bottom: `${p}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-0.5">
            {datos.map((d, i) => (
              <button
                key={d.etiqueta}
                type="button"
                aria-label={`${d.etiqueta}: ${d.valor} ${unidad}`}
                onPointerEnter={() => setActivo(i)}
                onPointerLeave={() => setActivo(null)}
                onFocus={() => setActivo(i)}
                onBlur={() => setActivo(null)}
                className="group relative flex h-full flex-1 items-end justify-center outline-none"
              >
                <span
                  className="w-full max-w-6 rounded-t-sm bg-lava-press transition-colors group-hover:bg-lava group-focus-visible:bg-lava"
                  style={{ height: `${(d.valor / tope) * 100}%` }}
                />
                {activo === i && (
                  <span
                    className="pointer-events-none absolute z-10 mb-2 rounded-field bg-surface-2 px-3 py-1.5 text-left whitespace-nowrap shadow-card"
                    style={{ bottom: `${(d.valor / tope) * 100}%` }}
                  >
                    <span className="block text-headline">
                      {d.valor} {unidad}
                    </span>
                    <span className="block text-caption text-grey">{d.etiqueta}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-0.5 pl-8 text-caption text-grey">
        {datos.map((d, i) => (
          <span key={d.etiqueta} className="flex-1 text-center">
            {i % cadaCuanto === 0 ? d.etiqueta : ''}
          </span>
        ))}
      </div>
      <TablaDatos datos={datos} columna={columna} unidad={unidad} />
    </figure>
  )
}

/** Barras horizontales de una sola serie con el valor en la punta (rankings cortos, ≤ 8 renglones). */
export function Barras({ datos, columna, unidad }: { datos: Dato[]; columna: string; unidad: string }) {
  const maximo = Math.max(1, ...datos.map((d) => d.valor))
  return (
    <figure className="space-y-3">
      <ul className="space-y-3">
        {datos.map((d) => (
          <li key={d.etiqueta} className="grid grid-cols-[7rem_1fr] items-center gap-3 text-subhead">
            <span className="truncate text-grey">{d.etiqueta}</span>
            <span className="flex items-center gap-2">
              <span
                className="h-3 rounded-r-sm bg-lava-press"
                style={{ width: `${(d.valor / maximo) * 85}%` }}
                aria-hidden="true"
              />
              <span className="tabular-nums">{d.valor}</span>
            </span>
          </li>
        ))}
      </ul>
      <TablaDatos datos={datos} columna={columna} unidad={unidad} />
    </figure>
  )
}
