import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/shopify',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxthub/core',
  ],

  shopify: {
    name: process.env.NUXT_SHOPIFY_NAME!,

    clients: {
      storefront: {
        apiVersion: process.env.NUXT_SHOPIFY_CLIENTS_STOREFRONT_API_VERSION,
        publicAccessToken: process.env.NUXT_SHOPIFY_CLIENTS_STOREFRONT_PUBLIC_ACCESS_TOKEN,
        retries: 3,

        cache: {
          presets: {
            short: { maxAge: 1, staleMaxAge: 9, swr: true },
            long: { maxAge: 3600, staleMaxAge: 82800, swr: true },
            catalog: { maxAge: 60, staleMaxAge: 240, swr: true },
          },
        },
      },
      customerAccount: {
        apiVersion: process.env.NUXT_SHOPIFY_CLIENTS_CUSTOMER_ACCOUNT_API_VERSION,
        clientId: process.env.NUXT_SHOPIFY_CLIENTS_CUSTOMER_ACCOUNT_CLIENT_ID!,
        afterLogin: '/account',
        afterLogout: '/',
      },
    },

    analytics: {
      storefrontId: process.env.NUXT_SHOPIFY_ANALYTICS_STOREFRONT_ID,
    },
  },

  klaviyo: {
    apiVersion: process.env.NUXT_KLAVIYO_API_VERSION,
    publicApiKey: process.env.NUXT_KLAVIYO_PUBLIC_API_KEY,
    privateApiKey: process.env.NUXT_KLAVIYO_PRIVATE_API_KEY,
  },

  site: {
    url: 'https://nitrogen.nuxt.dev',
    name: 'Nitrogen',
  },

  sitemap: {
    sources: [
      '/api/sitemap',
    ],
  },

  robots: {
    disallow: ['/account', '/account/*'],
    sitemap: 'https://nitrogen.nuxt.dev/sitemap.xml',
  },

  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },

  fonts: {
    defaults: {
      weights: [400, 500],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  css: ['@/assets/styles/app.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'embla-carousel-vue',
      ],
    },
  },

  components: [
    {
      path: '@/components',
      pathPrefix: false,
    },
  ],

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  compatibilityDate: '2026-08-17',
})
