import { defineConfig } from 'vite'

import { markdown } from '@foldkit/markdown/vite'
import { foldkit } from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    foldkit({
      ssr: {
        serverEntry: '/src/entry.server.ts',
        clientEntry: '/src/entry.ts',
        build: { prerender: true },
      },
    }),
    markdown(),
  ],
  optimizeDeps: {
    entries: ['src/entry.ts'],
  },
})
