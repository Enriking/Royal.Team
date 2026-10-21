import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge con los tokens propios de `src/styles/index.css`.
 * Sin esto, `text-title-1` se confundiría con un color y `rounded-card` no chocaría con `rounded-field`.
 * Si agregas un token nuevo de tipografía, radio, sombra o degradado, regístralo aquí.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['large-title', 'title-1', 'title-2', 'headline', 'body', 'subhead', 'caption'],
      radius: ['card', 'field', 'pill'],
      shadow: ['glow', 'card'],
    },
    classGroups: {
      'bg-image': [{ 'bg-gradient': ['black-grey', 'black-orange', 'orange-white'] }],
    },
  },
})

/** Une clases de Tailwind ignorando valores vacíos; si dos clases chocan, gana la última. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return twMerge(...classes)
}
