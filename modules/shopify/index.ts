import {
  defineNuxtModule,
  addImports,
  addServerImports,
  addServerHandler,
  createResolver,
} from '@nuxt/kit'

// Interface
export interface ModuleOptions {
  domain: string
  apiVersion: string
  adminAccessToken: string
  storefrontAccessToken: string
}

// Module
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nitrogen/shopify',
    configKey: 'shopify',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
    domain: '',
    apiVersion: '2025-01',
    adminAccessToken: '',
    storefrontAccessToken: '',
  },

  setup(options, nuxt) {
    nuxt.options.runtimeConfig.shopify = options

    const { resolve } = createResolver(import.meta.url)

    addImports({
      name: 'useShopify',
      from: resolve('runtime/composables/use-shopify'),
    })

    addServerImports([{
      name: 'useShopify',
      from: resolve('runtime/composables/use-shopify'),
    }])

    addServerHandler({
      method: 'post',
      route: '/api/shopify-admin',
      handler: resolve('runtime/server/shopify-admin.post'),
    })

    addServerHandler({
      method: 'post',
      route: '/api/shopify-storefront',
      handler: resolve('runtime/server/shopify-storefront.post'),
    })
  },
})
