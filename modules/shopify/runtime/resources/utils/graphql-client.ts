import type { DocumentNode } from 'graphql'

import { print } from 'graphql'

type QueryOptions = {
  api?: string
  maxRetries?: number
  cacheable?: boolean
}

const cache = new Map<string, any>()

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

  // Serialize query and create cache key
  const serializedQuery = print(query)
  const cacheKey = JSON.stringify({ query: serializedQuery, variables })

  // Cache only collection, product, and search queries
  const shouldCache = cacheable && /query Collection|query Product|query Search/i.test(serializedQuery)

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
        cache.set(cacheKey, response)
        setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000) // 5 minutes
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
