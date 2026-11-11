import { defineConfig } from "vite"

import { markdown } from "@foldkit/markdown/vite"
import { foldkit } from "@foldkit/vite-plugin"
import tailwindcss from "@tailwindcss/vite"

import { PostFrontmatter } from "./src/blog/frontmatter.ts"

export default defineConfig({
  plugins: [
    tailwindcss(),
    foldkit({
      ssr: {
        serverEntry: "/src/entry.server.ts",
        clientEntry: "/src/entry.ts",
        build: { prerender: true },
      },
    }),
    markdown({ frontmatter: PostFrontmatter }),
  ],
  optimizeDeps: {
    entries: ["src/entry.ts"],
  },
})
