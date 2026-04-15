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
  },

  defaults: {
    domain: '',
    apiVersion: '',
    adminAccessToken: '',
    storefrontAccessToken: '',
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.shopify = options

    const imports = [
      {
        name: 'useShopify',
        from: resolve('runtime/composables/use-shopify'),
      },
      {
        name: 'flattenConnection',
        from: resolve('runtime/utils/flatten-connection'),
      },
    ]

    addImports(imports)

    addServerImports(imports)

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
