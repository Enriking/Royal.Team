import { Clock, X } from 'lucide-react'
import { Badge, Button, Card, Input, Logo, LogoMark } from '@/components/ui'

const colors = [
  { name: 'Jet Black', hex: '#0B0B0C', cls: 'bg-jet border border-line', role: 'Fondo principal' },
  { name: 'Midnight', hex: '#131213', cls: 'bg-midnight border border-line', role: 'Fondo secundario' },
  { name: 'Surface', hex: '#1C1B1D', cls: 'bg-surface', role: 'Tarjetas' },
  { name: 'Text Grey', hex: '#8E8C91', cls: 'bg-grey', role: 'Texto secundario' },
  { name: 'Off White', hex: '#EEEEEE', cls: 'bg-offwhite', role: 'Texto principal' },
  { name: 'Lava Orange', hex: '#FF6A1A', cls: 'bg-lava', role: 'Acento' },
]

const type = [
  ['Large Title', 'text-large-title'],
  ['Title 1', 'text-title-1'],
  ['Title 2', 'text-title-2'],
  ['Headline', 'text-headline'],
  ['Body', 'text-body'],
  ['Subhead', 'text-subhead'],
  ['Caption', 'text-caption'],
] as const

/** Guía viva del sistema de diseño. Ruta: /design */
export default function SistemaDiseno() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 p-6 md:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Logo size="lg" />
        <p className="text-subhead text-grey">Sistema de diseño · v0.1</p>
      </header>

      {/* Marca */}
      <section className="grid gap-4 md:grid-cols-4">
        <Card className="grid aspect-square place-items-center">
          <LogoMark className="size-28 text-lava" />
        </Card>
        <Card variant="lava" className="grid aspect-square place-items-center">
          <LogoMark className="size-28 text-jet" />
        </Card>
        <Card className="grid aspect-square place-items-center">
          <LogoMark className="size-28 text-offwhite" />
        </Card>
        <div className="grid aspect-square place-items-center rounded-card bg-offwhite">
          <LogoMark className="size-28 text-lava" />
        </div>
      </section>

      {/* Tipografía y color */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card className="flex gap-8">
          <div>
            <p className="text-[7rem] leading-none font-extrabold tracking-tight">Aa</p>
            <p className="text-headline">Inter</p>
            <p className="text-caption text-grey">SF Pro en dispositivos Apple</p>
          </div>
          <div className="space-y-1">
            {type.map(([label, cls]) => (
              <p key={label} className={cls}>
                {label}
              </p>
            ))}
          </div>
        </Card>
        <div className="grid grid-cols-3 gap-3">
          {colors.map((c) => (
            <div key={c.name} className="space-y-2">
              <div className={`h-28 rounded-card ${c.cls}`} />
              <p className="text-subhead font-semibold">{c.name}</p>
              <p className="text-caption text-grey">
                {c.hex} · {c.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Degradados */}
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="h-20 rounded-card bg-gradient-black-grey p-4 text-caption font-semibold">
          GRADIENTE 1 · NEGRO–GRIS
        </div>
        <div className="h-20 rounded-card bg-gradient-black-orange p-4 text-caption font-semibold">
          GRADIENTE 2 · NEGRO–NARANJA
        </div>
        <div className="h-20 rounded-card bg-gradient-orange-white p-4 text-caption font-semibold text-jet">
          GRADIENTE 3 · NARANJA–BLANCO
        </div>
      </section>

      {/* Componentes */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <Card variant="outline" className="space-y-6">
            <p className="text-title-2">title</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline">date</Badge>
              <span className="text-headline">time</span>
            </div>
          </Card>
          <Card variant="gradient" className="space-y-1">
            <div className="flex justify-end">
              <Badge>label</Badge>
            </div>
            <p className="pt-6 text-title-2">Title</p>
            <p className="text-caption text-grey">Subtitle</p>
          </Card>
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-grey" />
            <span className="text-subhead">label</span>
            <Badge>time</Badge>
            <Badge>label</Badge>
            <X className="size-5" />
          </div>
        </div>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-title-2 text-lava">Pide tu canción</p>
            <X className="size-6" />
          </div>
          <p className="text-subhead text-grey">Sinatra Canta Bar · Mesa 12</p>
          <p className="pt-2 text-headline">Registro</p>
          <Input placeholder="Tu nombre" />
          <Input placeholder="Iniciales (3 letras)" maxLength={3} />
          <Input placeholder="Canción o artista" />
          <Button className="w-full" disabled>
            Enviar
          </Button>
          <Button className="w-full">Enviar</Button>
        </Card>

        <div className="space-y-4">
          <div className="flex gap-3">
            {['Bandeja', 'Fila', 'Ranking'].map((t, i) => (
              <div
                key={t}
                className={`flex h-40 w-14 items-end justify-center rounded-full pb-4 ${i === 0 ? 'border-2 border-lava' : 'bg-surface-2'}`}
              >
                <span className="rotate-180 text-subhead [writing-mode:vertical-rl]">{t}</span>
              </div>
            ))}
          </div>
          <Input placeholder="Placeholder" />
          <Input variant="lava" placeholder="Placeholder" />
          <Input variant="grey" placeholder="Placeholder" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Primario</Button>
            <Button size="sm" variant="outline">
              Contorno
            </Button>
            <Button size="sm" variant="secondary">
              Secundario
            </Button>
            <Button size="sm" variant="ghost">
              Fantasma
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
