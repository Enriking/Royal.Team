import { Placeholder } from '@/components/ui'

export default function Fila() {
  return (
    <>
      <h1 className="text-title-1">Fila</h1>
      <Placeholder
        title="Control de turnos"
        feature="cola"
        items={[
          'Fila por rondas y "subir turno"',
          'Llamar al siguiente y poner la canción con el Puente',
          'Marcar terminó → valoración',
        ]}
      />
    </>
  )
}
