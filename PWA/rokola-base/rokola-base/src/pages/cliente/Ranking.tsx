import { useState } from 'react'
import { Segmentos } from '@/components/ui'
import { EstrellaNoche, nombreMes, TablaRecords, useSalonDeLaFama, useTopNoche } from '@/features/ranking'

export default function Ranking() {
  const [vista, setVista] = useState<'noche' | 'mes'>('noche')
  const top = useTopNoche()
  const salon = useSalonDeLaFama()

  return (
    <>
      <h1 className="pt-2 text-title-1">Ranking</h1>
      <Segmentos
        opciones={[
          { valor: 'noche', texto: 'Esta noche' },
          { valor: 'mes', texto: 'Salón de la fama' },
        ]}
        valor={vista}
        alCambiar={setVista}
      />

      {vista === 'noche' ? (
        <>
          {top[0] && <EstrellaNoche solicitud={top[0]} />}
          <TablaRecords
            registros={top}
            vacio={<p>Pide una canción con “Quiero competir” y pon tus iniciales aquí.</p>}
          />
        </>
      ) : (
        <>
          <p className="text-subhead text-grey capitalize">{nombreMes(salon.mes)}</p>
          <TablaRecords registros={salon.registros} vacio={<p>Los mejores puntajes del mes aparecerán aquí.</p>} />
        </>
      )}
    </>
  )
}
