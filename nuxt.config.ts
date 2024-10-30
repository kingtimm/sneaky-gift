// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/ui',
    'vue-clerk/nuxt',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  clerk: {
    appearance: {}
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

  hub: {
    database: true,
    kv: true,
    cache: true,
  },
  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true
    }
  },
  // Development
  devtools: { enabled: true },
})