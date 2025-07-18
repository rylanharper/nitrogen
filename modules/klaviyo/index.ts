import {
  defineNuxtModule,
  addImports,
  addServerHandler,
  createResolver,
} from '@nuxt/kit'

// Interface
export interface ModuleOptions {
  apiVersion: string
  publicApiKey: string
  privateApiKey: string
}

// Module
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nikkoel/klaviyo',
    configKey: 'klaviyo',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
    apiVersion: '2025-01-15',
    publicApiKey: '',
    privateApiKey: '',
  },

  setup(options, nuxt) {
    nuxt.options.runtimeConfig.klaviyo = options

    const { resolve } = createResolver(import.meta.url)

    addImports({
      name: 'useKlaviyo',
      from: resolve('runtime/composables/use-klaviyo'),
    })

    addServerHandler({
      method: 'post',
      route: '/api/klaviyo',
      handler: resolve('runtime/server/klaviyo.post'),
    })
  },
})
