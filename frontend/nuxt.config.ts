// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000",
    },
  },
  nitro: {
    devProxy: {
      "/api": {
        target: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  alias: {
    '@models': '~/domain/models'
  },
  imports: {
    dirs: [
      'domain/**',
      'application/**',
      'composables/**'
    ]
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  devtools: { enabled: true }
})