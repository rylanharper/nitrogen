import type { DocumentNode } from 'graphql'

import { print } from 'graphql'
import { hash } from 'ohash'

type QueryOptions = {
  api?: string
  maxRetries?: number
  cacheable?: boolean
}

const cache = new Map<string, any>()
const CACHEABLE_QUERY = /query Collection|query Product|query Search/i // Cache only collections, products, and search queries
const MAX_CACHE_SIZE = 50 // Maximum number of entries in the cache, 25-100 is recommended
const CACHE_TTL = 5 * 60 * 1000 // Individual cache keys expire after 5 minutes

/**
 * A minimal GraphQL client that sends a query to the Shopify API.
 * @param query - The GraphQL query as a DocumentNode
 * @param variables - Optional variables for the GraphQL query
 * @returns The response from the Shopify API
 */
export const query = async (
  query: DocumentNode,
  variables: Record<string, any> = {},
  options: QueryOptions = {},
) => {
  const {
    api = 'storefront',
    maxRetries = 3,
    cacheable = true,
  } = options

  // Serialize query and evaluate cacheability
  const serializedQuery = print(query)
  const shouldCache = cacheable && CACHEABLE_QUERY.test(serializedQuery)

  // Use `ohash` for efficient cache key generation
  const cacheKey = shouldCache ? hash({ query: serializedQuery, variables }) : ''

  // Return cached response if applicable
  if (shouldCache && cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  // Sends a fetch request to the Shopify API
  const fetchRequest = async (retryCount = 0) => {
    try {
      const response = await $fetch(`/api/shopify-${api}`, {
        method: 'POST',
        body: { query: serializedQuery, variables },
      })

      // Cache response only if applicable
      if (shouldCache) {
        if (cache.size >= MAX_CACHE_SIZE) {
          const firstKey = cache.keys().next().value
          if (firstKey) cache.delete(firstKey)
        }

        cache.set(cacheKey, response)
        setTimeout(() => cache.delete(cacheKey), CACHE_TTL)
      }

      return response
    } catch (error: any) {
      const count = retryCount + 1

      if (retryCount < maxRetries) {
        console.warn(`Retrying ${api} API fetch request (${count}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return fetchRequest(count)
      }

      throw createError({
        statusCode: 500,
        statusMessage: `Shopify API error: GraphQL request failed after ${maxRetries} attempts.`,
        data: { error: error.message },
      })
    }
  }

  return fetchRequest()
}
