import { defineConfig } from 'vitest/config'

import { markdown } from '@foldkit/markdown/vite'

export default defineConfig({
  plugins: [markdown()],

  test: {
    include: ['src/**/*.{test,spec}.ts'],
    environment: 'happy-dom',
    setupFiles: ['./src/vitest-setup.ts'],
    server: {
      deps: {
        inline: ['foldkit', '@foldkit/ui', '@foldkit/devtools'],
      },
    },
  },
})
