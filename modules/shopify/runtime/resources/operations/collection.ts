import type {
  CollectionQuery,
  CollectionQueryVariables,
  CollectionFiltersQuery,
  CollectionFiltersQueryVariables,
} from '@@/types/shopify-storefront'

import {
  COLLECTION,
  COLLECTION_FILTERS,
} from '../graphql/storefront/queries/collection'
import { query } from '../utils/graphql-client'

/**
 * Fetches the collection data.
 * @param variables - The variables for the collection query (handle, filters, etc.)
 * @returns A Promise resolving to the collection data
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/collection
 */
const get = async (
  variables: CollectionQueryVariables,
): Promise<CollectionQuery['collection']> => {
  const response = await query(COLLECTION, variables)
  return response.data?.collection
}

/**
 * Fetches the collection filter data.
 * @param variables - The variables for the collection query (handle)
 * @returns A Promise resolving to the collection filters data
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/collection
 */
const getFilters = async (
  variables: CollectionFiltersQueryVariables,
): Promise<CollectionFiltersQuery['collection']> => {
  const response = await query(COLLECTION_FILTERS, variables)
  return response.data?.collection
}

export default {
  get,
  getFilters,
}
