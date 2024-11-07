// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    shopify: {
      shop: process.env.SHOPIFY_STOREFRONT,
      token: process.env.SHOPIFY_ACCESS_TOKEN,
      version: process.env.SHOPIFY_API_VERSION
    }
  },

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@nuxt/icon'
  ],

  icon: {
    mode: 'svg',
    clientBundle: { scan: true }
  },

  fonts: {
    families: [
      { name: 'IBM Plex Mono', provider: 'google' },
      { name: 'IBM Plex Sans', provider: 'google' }
    ],
    defaults: {
      weights: [400, 500, 600]
    }
  },

  tailwindcss: {
    cssPath: '@/assets/styles/app.css'
  },

  components: [
    {
      path: '@/components',
      pathPrefix: false
    }
  ]
});
