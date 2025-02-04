import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: true,
        prefetchOn: {
          visibility: false,
          interaction: true
        }
      }
    }
  },

  devtools: {
    enabled: true
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
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon'
  ],

  icon: {
    mode: 'svg'
  },

  css: ['@/assets/styles/app.css'],

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  routeRules: {
    '/**': { isr: 60 }
  },

  components: [
    {
      path: '@/components',
      pathPrefix: false
    }
  ]
});
