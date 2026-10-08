import { Card, LogoMark } from '@/components/ui'

/** Pantalla de TV del bar. Aquí vivirá la rocola 3D (features/pantalla). */
export default function Rocola() {
  return (
    <div className="grid min-h-dvh grid-cols-[1.4fr_1fr] gap-8 bg-jet p-12">
      <Card className="grid place-items-center bg-gradient-black-orange">
        <div className="text-center">
          <LogoMark className="mx-auto size-48 text-offwhite" />
          <p className="mt-6 text-title-1">Rocola 3D</p>
          <p className="text-subhead text-offwhite/70">Aquí va la escena de Three.js</p>
        </div>
      </Card>
      <div className="flex flex-col gap-4">
        <p className="text-caption tracking-[0.25em] text-grey uppercase">Siguen</p>
        {['LUP · Bamboleo', 'MAR · Mi gusto es', 'JOS · El triste'].map((t, i) => (
          <Card key={t} variant={i === 0 ? 'outline' : 'default'} className="flex justify-between text-title-2">
            {t}
            <span className="text-lava">{i + 1}</span>
          </Card>
        ))}
        <Card variant="lava" className="mt-auto text-center text-title-2">
          Escanea y pide tu canción
        </Card>
      </div>
    </div>
  )
}
