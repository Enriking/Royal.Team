/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Rokola · configuración base
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Nota: el service worker precachea todo el JS, incluidas las áreas que el cliente no usa.
    // Cuando la pantalla cargue Three.js, exclúyelo con `workbox.globIgnores` para no gastar datos en los celulares.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'brand/*.svg'],
      manifest: {
        name: 'Rokola',
        short_name: 'Rokola',
        description: 'La fila del karaoke, desde el celular.',
        lang: 'es-MX',
        theme_color: '#0B0B0C',
        background_color: '#0B0B0C',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { host: true }, // permite abrir la app desde celulares en la misma red
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
