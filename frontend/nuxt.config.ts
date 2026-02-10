// nuxt.config.ts
const apiBase = process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000"
const apiOrigin = (() => {
  try {
    return new URL(apiBase).origin
  } catch {
    return apiBase
  }
})()

const isProd = process.env.NODE_ENV === "production"
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  `connect-src 'self' ${apiOrigin}`
].join("; ")

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    public: {
      apiBase,
      persistAuth: process.env.NUXT_PUBLIC_PERSIST_AUTH !== "false"
    },
  },
  nitro: {
    devProxy: {
      "/api": {
        target: apiBase,
        changeOrigin: true,
      },
    },
  },
  routeRules: isProd ? {
    "/**": {
      headers: {
        "Content-Security-Policy": csp,
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
      }
    }
  } : {},
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
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Formulateur Cosmétique',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Formulateur de cosmétiques maison' }
      ]
    }
  },
  devtools: { enabled: true }
})
