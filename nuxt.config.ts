import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      wrangler: {
        d1_databases: [
          {
            binding: "DB",
            database_name: "gxuvain-dev",
            database_id: "8953eab1-a884-4749-b524-7eddfbc9eb0c",
          },
        ],
      },
    },
  },
  content: {
    database: {
      type: "d1",
      bindingName: "DB",
    },
  },
  modules: ["@nuxt/eslint", "@nuxt/content", "@nuxt/icon", "@nuxtjs/color-mode", "nuxt-toc"],
  css: ["~/assets/css/main.css"],
  colorMode: { fallback: "dark" },
  vite: {
    plugins: [tailwindcss()],
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
})
