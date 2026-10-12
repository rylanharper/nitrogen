const COOKIE_OPTIONS = {
  sameSite: 'lax',
  secure: !import.meta.dev,
  maxAge: 60 * 60 * 24 * 365, // 1 year
} as const

const getPath = (source: any, path: string) =>
  path.split('.').reduce((value, key) => value?.[key], source)

const setPath = (target: any, path: string, value: unknown) => {
  const keys = path.split('.')
  const last = keys.pop()!
  keys.reduce((node, key) => (node[key] ??= {}), target)[last] = value
}

/**
 * Persist Pinia state to cookies via the `persist` option.
 */
export default defineNuxtPlugin({
  name: 'pinia-persist',
  dependsOn: ['pinia'],
  setup({ $pinia }) {
    $pinia.use(({ store, options }) => {
      if (!options.persist) return

      const { pick } = options.persist
      const cookie = useCookie<Record<string, any> | null>(store.$id, {
        ...COOKIE_OPTIONS,
        default: () => null,
      })

      // Hydrate (deeply merge nested objects)
      if (cookie.value) store.$patch(cookie.value)

      // Persist
      store.$subscribe(
        (_mutation, state) => {
          const snapshot = {}
          for (const path of pick) setPath(snapshot, path, getPath(state, path))
          cookie.value = snapshot
        },
        { detached: true },
      )
    })
  },
})
