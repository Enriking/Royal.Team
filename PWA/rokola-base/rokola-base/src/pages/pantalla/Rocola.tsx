import { useFila } from '@/features/cola'
import {
  ControlesPantalla,
  EscenarioPantalla,
  ProximosTurnos,
  QrUnirse,
  useAplausometroPantalla,
} from '@/features/pantalla'
import { TablaRecords, useTopNoche } from '@/features/ranking'
import { useCierreAutomatico, useRegistrarAplausos } from '@/features/votacion'

/** Pantalla de TV del bar. Ábrela en pantalla completa en la computadora conectada a la TV. */
export default function Rocola() {
  const { valorando } = useFila()
  const aplausometro = useAplausometroPantalla()
  const { micro } = aplausometro
  const top = useTopNoche(3)

  useCierreAutomatico()
  useRegistrarAplausos(valorando, micro.nivel, micro.estado === 'activo')

  return (
    // En pantalla grande todo cabe en una sola vista (una TV no se desplaza)
    <div className="grid min-h-dvh gap-8 bg-jet p-6 lg:h-dvh lg:grid-cols-[1.5fr_1fr] lg:grid-rows-[minmax(0,1fr)] lg:overflow-hidden lg:p-10">
      <EscenarioPantalla nivelMicro={micro.estado === 'activo' ? micro.nivel : null} />
      <div className="flex min-h-0 flex-col gap-8">
        <ProximosTurnos className="flex-1" />
        {top.length > 0 && (
          <section className="shrink-0 space-y-3">
            <h2 className="text-headline tracking-[0.25em] text-grey uppercase">Récords de la noche</h2>
            <TablaRecords registros={top} />
          </section>
        )}
        <QrUnirse className="shrink-0" />
      </div>
      <ControlesPantalla {...aplausometro} />
    </div>
  )
}
