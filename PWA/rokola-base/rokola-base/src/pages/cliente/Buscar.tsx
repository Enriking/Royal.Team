import { Disc3, PencilLine, Search, SearchX } from 'lucide-react'
import { useState } from 'react'
import { Button, Input, Vacio } from '@/components/ui'
import { CancionItem, useBusqueda } from '@/features/catalogo'
import { HojaPedido, type Pedido } from '@/features/cola'

export default function Buscar() {
  const [consulta, setConsulta] = useState('')
  const { resultados, totalCatalogo } = useBusqueda(consulta)
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const pedirEscrita = () => setPedido({ cancion: null })

  return (
    <>
      <h1 className="pt-2 text-title-1">Buscar</h1>
      <div className="relative">
        <Search className="pointer-events-none absolute top-3.5 left-4 size-5 text-grey" />
        <Input
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Título o artista"
          aria-label="Buscar canción"
          enterKeyHint="search"
          className="pl-12"
        />
      </div>

      {totalCatalogo === 0 ? (
        <Vacio icono={Disc3} titulo="El DJ aún no carga el catálogo">
          <p>Mientras, puedes pedir tu canción escribiéndola.</p>
        </Vacio>
      ) : !consulta.trim() ? (
        <p className="text-subhead text-grey">
          Busca entre {totalCatalogo} canciones. No importan los acentos ni los errores de dedo.
        </p>
      ) : resultados.length === 0 ? (
        <Vacio icono={SearchX} titulo={`No encontramos “${consulta.trim()}”`}>
          <p>Pídela escrita y el DJ revisa si la tiene.</p>
        </Vacio>
      ) : (
        <div className="divide-y divide-line/60">
          {resultados.map((c) => (
            <CancionItem
              key={c.id}
              titulo={c.titulo}
              artista={c.artista}
              detalle={c.genero}
              onClick={() => setPedido({ cancion: c })}
            />
          ))}
        </div>
      )}

      <Button variant="outline" className="w-full" onClick={pedirEscrita}>
        <PencilLine className="size-5" /> ¿No está? Pídela escrita
      </Button>

      <HojaPedido pedido={pedido} alCerrar={() => setPedido(null)} />
    </>
  )
}
