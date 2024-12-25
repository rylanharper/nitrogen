// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  devtools: {
    enabled: true
  },

  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          visibility: false,
          interaction: true
        }
      }
    }
  },

  runtimeConfig: {
    shopify: {
      storefront: process.env.NUXT_SHOPIFY_STOREFRONT,
      accessToken: process.env.NUXT_SHOPIFY_ACCESS_TOKEN,
      apiVersion: process.env.NUXT_SHOPIFY_API_VERSION
    },
    klaviyo: {
      publicApiKey: process.env.NUXT_KLAVIYO_PUBLIC_API_KEY,
      privateApiKey: process.env.NUXT_KLAVIYO_PRIVATE_API_KEY,
      apiVersion: process.env.NUXT_KLAVIYO_API_VERSION
    }
  },

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon'
  ],

  fonts: {
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
