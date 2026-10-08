import { Input, Placeholder } from '@/components/ui'

export default function Buscar() {
  return (
    <>
      <h1 className="pt-2 text-title-1">Buscar</h1>
      <Input placeholder="Título o artista" />
      <Placeholder
        title="Buscador y pedido"
        feature="catalogo"
        items={[
          'Búsqueda sin acentos ni errores',
          'Pedir canción (catálogo o texto libre)',
          'Dueto, nota al DJ y “quiero competir”',
        ]}
      />
    </>
  )
}
