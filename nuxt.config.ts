// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@nuxt/icon',
  ],

  components: [
    {
      path: '@/components',
      pathPrefix: false,
    },
  ],

  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    shopify: {
      storefront: '',
      accessToken: '',
      apiVersion: '',
    },
  },
  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          visibility: false,
          interaction: true,
        },
      },
    },
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600],
    },
  },

  icon: {
    mode: 'svg',
    clientBundle: {
      scan: true,
    },
  },

  tailwindcss: {
    cssPath: '@/assets/styles/app.css',
  },
});
