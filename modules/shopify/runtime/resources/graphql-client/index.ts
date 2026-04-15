import type { DocumentNode } from 'graphql'
import { print } from 'graphql'
import { hash } from 'ohash'

interface QueryOptions {
  api?: string
  maxRetries?: number
  cacheable?: boolean
}

const CACHEABLE_OPS = /query Collection|query Product|query Search/i
const MAX_CACHE_SIZE = 50
const CACHE_TTL = 5 * 60 * 1000

const cache = new Map<string, { data: unknown, timer: ReturnType<typeof setTimeout> }>()

// Generates a stable cache key from the query and variables
const getCacheKey = (serialized: string, variables: Record<string, unknown>): string => {
  return hash({ query: serialized, variables })
}

// Returns cached data if present
const getCache = <T>(key: string): T | undefined => {
  return cache.get(key)?.data as T | undefined
}

// Evicts the oldest cache if at capacity, then stores data with a TTL timer
const setCache = (key: string, data: unknown): void => {
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldest = cache.keys().next().value!
    clearTimeout(cache.get(oldest)!.timer)
    cache.delete(oldest)
  }
  const timer = setTimeout(() => cache.delete(key), CACHE_TTL)
  cache.set(key, { data, timer })
}

/**
 * A minimal GraphQL client that sends a query to the Shopify API.
 * @param document - The GraphQL query as a DocumentNode
 * @param variables - Optional variables for the GraphQL query
 * @param options - Optional configuration for the request
 * @returns The response from the Shopify API
 */
export const query = async <T = unknown>(
  document: DocumentNode,
  variables: Record<string, unknown> = {},
  options: QueryOptions = {},
): Promise<T> => {
  const { api = 'storefront', maxRetries = 3, cacheable = true } = options

  const serialized = print(document)
  const shouldCache = cacheable && CACHEABLE_OPS.test(serialized)
  const cacheKey = shouldCache ? getCacheKey(serialized, variables) : ''

  if (shouldCache) {
    const cached = getCache<T>(cacheKey)
    if (cached !== undefined) return cached
  }

  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      console.warn(`Retrying ${api} API request (${attempt}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    try {
      const response = await $fetch<T>(`/api/shopify-${api}`, {
        method: 'POST',
        body: { query: serialized, variables },
      }) as T

      if (shouldCache) setCache(cacheKey, response)
      return response
    } catch (error: any) {
      lastError = error
    }
  }

  throw createError({
    statusCode: 500,
    statusMessage: `Shopify API error: request failed after ${maxRetries} retries.`,
    data: { error: lastError?.message },
  })
}
