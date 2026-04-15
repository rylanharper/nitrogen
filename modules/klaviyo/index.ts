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
    name: '@nitrogen/klaviyo',
    configKey: 'klaviyo',
  },

  defaults: {
    apiVersion: '',
    publicApiKey: '',
    privateApiKey: '',
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.klaviyo = options

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
