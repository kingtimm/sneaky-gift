// https://nuxt.com/docs/api/configuration/nuxt-config
import {dark} from '@clerk/themes'

export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: {compatibilityVersion: 4},
  // Nuxt Modules
  // https://nuxt.com/modules
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    'vue-clerk/nuxt',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@formkit/auto-animate/nuxt',
    '@pinia/colada-nuxt',
    'nuxt-og-image',
    '@nuxtjs/mdc'
  ],
  uiPro: {
  },
  clerk: {
    appearance: {
      baseTheme: dark
    }
  },
  fonts: {
    defaults: {
      weights: [200, 400],
      styles: ["normal"]
    },
    experimental: {
      processCSSVariables: true,
    },
  },
  ogImage: {
    fonts: [
      // will load the Noto Sans font from Google fonts
      'Lilita+One:200',
      'Lilita+One:400'
    ]
  },
  routeRules: {
    '/create/**': {ssr: false},
    '/lists/**': {ssr: false},
  },

  hub: {
    database: true,
    kv: true,
    cache: true,
  },
  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: false
    }
  },
  // Development
  devtools: {enabled: true},
})