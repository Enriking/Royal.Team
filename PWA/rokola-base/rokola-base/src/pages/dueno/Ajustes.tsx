import { Placeholder } from '@/components/ui'

export default function Ajustes() {
  return (
    <>
      <h1 className="text-title-1">Ajustes</h1>
      <Placeholder
        title="Configuración del bar"
        feature="cola · votacion"
        items={[
          'Reglas de la fila (rondas)',
          'Pesos del puntaje: aplausos, calificación y energía',
          'Mesas y sus códigos QR',
        ]}
      />
    </>
  )
}
