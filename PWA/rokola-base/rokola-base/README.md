# Rokola · base del proyecto

La fila del karaoke, desde el celular. PWA para Sinatra Canta Bar.

## Stack

| Pieza               | Herramienta                                        |
| ------------------- | -------------------------------------------------- |
| Interfaz            | React 19 + Vite + TypeScript                       |
| Estilos             | Tailwind CSS v4 (tokens en `src/styles/index.css`) |
| Rutas               | React Router (cada vista se carga bajo demanda)    |
| Animaciones         | Motion                                             |
| Íconos              | Lucide                                             |
| Datos y tiempo real | Supabase (Postgres + Realtime + Auth)              |
| App instalable      | vite-plugin-pwa                                    |
| Calidad             | oxlint · Prettier · Vitest · CI en GitHub Actions  |
| Tipografía          | SF Pro en Apple, Inter Variable en lo demás        |

## Arrancar

Requiere Node 22.12 o superior (ver `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # llenar con los datos de Supabase (opcional por ahora)
npm run dev                  # http://localhost:5173
```

Para probar en celulares: abre la dirección "Network" que imprime `npm run dev` desde un teléfono en el mismo Wi-Fi.

En VS Code, acepta las extensiones recomendadas (oxc, Prettier, Tailwind): el código se formatea solo al guardar.

## Scripts

| Comando                    | Qué hace                                                             |
| -------------------------- | -------------------------------------------------------------------- |
| `npm run dev`              | Servidor de desarrollo                                               |
| `npm run build`            | Revisa tipos y genera `dist/`                                        |
| `npm run preview`          | Sirve `dist/` para probar la versión final                           |
| `npm run check`            | **Lint + tipos + pruebas + formato. Córrelo antes de subir cambios** |
| `npm run test:watch`       | Pruebas en modo vigilancia                                           |
| `npm run format`           | Formatea todo el proyecto                                            |
| `npm run db:new -- nombre` | Crea una migración SQL vacía en `supabase/migrations/`               |
| `npm run db:push`          | Aplica las migraciones al proyecto de Supabase vinculado             |
| `npm run db:types`         | Regenera `src/lib/database.types.ts` desde la base                   |

## Rutas

| Ruta        | Vista                                                                |
| ----------- | -------------------------------------------------------------------- |
| `/`         | Hub de desarrollo (acceso a todas las vistas)                        |
| `/m/:mesa`  | App del cliente (QR de cada mesa): Inicio, Buscar, Mi turno, Ranking |
| `/dj`       | Panel del DJ: Bandeja, Fila                                          |
| `/dueno`    | Panel del dueño: Estadísticas, Ajustes                               |
| `/pantalla` | Pantalla de TV del bar                                               |
| `/design`   | Sistema de diseño (colores, tipografía, componentes)                 |

## Estructura

```
src/
  app/router.ts           mapa general de rutas (raíz, carga y errores)
  styles/index.css        tokens de diseño (colores, tipografía, radios, degradados)
  lib/                    supabase.ts, database.types.ts (generado), cn.ts
  components/ui/          Button, ButtonLink, Card, Badge, Input, Logo, Placeholder
  components/layout/      ClientShell (celular), DashShell (DJ/dueño), PageLoader, RouteError
  pages/<área>/           una carpeta por área: cliente, dj, dueno, pantalla, design
    routes.ts             las rutas del área
    Layout.tsx            su marco y menú
  features/<nombre>/      la lógica de cada característica (se construye aquí)
    cola/  catalogo/  votacion/  ranking/  pantalla/
public/brand/             logo provisional (SVG)
supabase/                 configuración, migraciones y seed.sql
```

## Convenciones

- Las **páginas** solo arman la vista; la **lógica** (hooks, consultas, reglas) vive en `features/`.
- Cada área es dueña de su carpeta en `pages/`: para agregar una vista del DJ se crea la página, se registra en `pages/dj/routes.ts` y, si va en el menú, en `pages/dj/Layout.tsx`. No hace falta tocar `app/router.ts`.
- Las vistas exportan su componente por defecto (`export default function …`) y se cargan bajo demanda, así la primera carga del celular solo trae la vista que abrió (después, la PWA guarda el resto en segundo plano; ver la nota en `vite.config.ts`).
- Cada característica expone su API pública en `features/<nombre>/index.ts`. Fuera de la característica se importa solo de ahí (`@/features/cola`); el lint marca error si se importan sus archivos internos. Una organización sugerida:

  ```
  features/cola/
    index.ts          lo único que importan las páginas
    api.ts            consultas a Supabase
    useCola.ts        hooks de React
    reglas.ts         lógica pura (rondas, turnos): fácil de probar
    reglas.test.ts    sus pruebas
    components/       piezas visuales propias
  ```

- Clases condicionales con `cn()`: si dos clases chocan, gana la última (`cn('p-5', 'p-0')` → `p-0`). Si agregas un token nuevo de tipografía, radio, sombra o degradado en `index.css`, regístralo también en `src/lib/cn.ts`.
- Para navegar con apariencia de botón usa `ButtonLink`, no un `Button` dentro de un `Link`.

## Base de datos (Supabase)

El esquema vive en `supabase/migrations/` como archivos SQL; nunca se cambia la base a mano desde el panel.

**Con un proyecto en la nube** (no requiere Docker):

1. Crea un proyecto en [supabase.com](https://supabase.com) y copia su URL y clave pública en `.env.local`.
2. `npx supabase login` y `npx supabase link --project-ref <id-del-proyecto>` (una sola vez).
3. `npm run db:new -- crear_canciones` → escribe el SQL en el archivo creado.
4. `npm run db:push` para aplicarlo y `npm run db:types` para actualizar los tipos de TypeScript.

**En local** (requiere Docker Desktop): `npx supabase start` levanta la base y muestra URL y clave; `npx supabase db reset` aplica migraciones + `seed.sql`; los tipos se generan con `npx supabase gen types --local > src/lib/database.types.ts`.

## Ramas y flujo de trabajo

- `main` siempre funciona. Cada característica se desarrolla en su rama: `feature/cola`, `feature/catalogo`, `feature/votacion`, `feature/ranking`, `feature/pantalla`.
- Cada rama toca su carpeta de `features/` y su área de `pages/`. Los cambios a archivos compartidos (`components/ui`, `styles`, `lib`, `app`) van en un cambio pequeño y aparte, para no chocar con las demás ramas.
- Antes de abrir un pull request: `npm run check`. En GitHub, el CI corre lo mismo más el build en cada rama.
- Migraciones: una por cambio y nunca se edita una que ya está en `main`; si algo cambió, se crea otra.

## Publicar

En el hosting (Vercel, Netlify, etc.) configura que toda ruta responda con `index.html`; si no, los QR (`/m/12`) darán 404.

## Paleta

| Token                   | Hex               | Uso              |
| ----------------------- | ----------------- | ---------------- |
| `jet`                   | #0B0B0C           | Fondo principal  |
| `midnight`              | #131213           | Fondo secundario |
| `surface` / `surface-2` | #1C1B1D / #262528 | Tarjetas, inputs |
| `grey`                  | #8E8C91           | Texto secundario |
| `offwhite`              | #EEEEEE           | Texto principal  |
| `lava`                  | #FF6A1A           | Acento           |

Uso en clases: `bg-lava`, `text-grey`, `rounded-card`, `text-title-1`, `bg-gradient-black-orange`.
