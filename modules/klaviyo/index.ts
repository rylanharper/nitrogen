import {
  defineNuxtModule,
  addImports,
  addServerHandler,
  createResolver,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@nikkoel/klaviyo',
    configKey: 'klaviyo',
    compatibility: { nuxt: '^3.0.0' },
  },

  schema: {
    apiVersion: '',
    publicApiKey: '',
    privateApiKey: '',
  },

  defaults: {
    apiVersion: '2025-01-15',
  },

  setup(options, nuxt) {
    nuxt.options.runtimeConfig.klaviyo = {
      apiVersion: options.apiVersion,
      publicApiKey: options.publicApiKey,
      privateApiKey: options.privateApiKey,
    }

    const { resolve } = createResolver(import.meta.url)

    addImports({
      name: 'useKlaviyo',
      from: resolve('runtime/composables/use-klaviyo.ts'),
    })

    addServerHandler({
      method: 'post',
      route: '/api/klaviyo',
      handler: resolve('runtime/server/api/klaviyo.post.ts'),
    })
  },
})
