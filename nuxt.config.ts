// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  devtools: {
    enabled: true
  },

  experimental: {
    payloadExtraction: true,
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
      storefront: '',
      accessToken: '',
      apiVersion: ''
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
    clientBundle: {
      scan: true
    }
  },

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
