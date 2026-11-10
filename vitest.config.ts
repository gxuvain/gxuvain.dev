import { defineConfig } from 'vitest/config'

import { markdown } from '@foldkit/markdown/vite'

import { PostFrontmatter } from './src/blog/frontmatter.ts'

export default defineConfig({
  plugins: [markdown({ frontmatter: PostFrontmatter })],

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
