import {
  defineNuxtModule,
  addImports,
  addServerImports,
  addServerHandler,
  createResolver,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@nikkoel/shopify',
    configKey: 'shopify',
    compatibility: { nuxt: '^3.0.0' },
  },

  schema: {
    domain: '',
    apiVersion: '',
    adminAccessToken: '',
    storefrontAccessToken: '',
  },

  defaults: {
    apiVersion: '2025-01',
  },

  setup(options, nuxt) {
    nuxt.options.runtimeConfig.shopify = {
      domain: options.domain,
      apiVersion: options.apiVersion,
      adminAccessToken: options.adminAccessToken,
      storefrontAccessToken: options.storefrontAccessToken,
    }

    const { resolve } = createResolver(import.meta.url)

    addImports({
      name: 'useShopify',
      from: resolve('runtime/composables/use-shopify.ts'),
    })

    addServerImports([{
      name: 'useShopify',
      from: resolve('runtime/composables/use-shopify.ts'),
    }])

    addServerHandler({
      method: 'post',
      route: '/api/shopify-admin',
      handler: resolve('runtime/server/api/shopify-admin.post.ts'),
    })

    addServerHandler({
      method: 'post',
      route: '/api/shopify-storefront',
      handler: resolve('runtime/server/api/shopify-storefront.post.ts'),
    })
  },
})
