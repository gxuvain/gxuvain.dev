import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
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
});
