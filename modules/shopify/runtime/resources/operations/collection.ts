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
import { query } from '../graphql-client'

/**
 * Fetches the collection data.
 * @param variables - The variables for the collection query (handle, filters, etc.)
 * @returns A Promise resolving to the collection data
 * @see https://shopify.dev/docs/api/storefront/latest/queries/collection
 */
const get = async (variables: CollectionQueryVariables) => {
  const { data } = await query<{ data: CollectionQuery }>(COLLECTION, variables)
  return data?.collection
}

/**
 * Fetches the collection filter data.
 * @param variables - The variables for the collection query (handle)
 * @returns A Promise resolving to the collection filters data
 * @see https://shopify.dev/docs/api/storefront/latest/queries/collection
 */
const getFilters = async (variables: CollectionFiltersQueryVariables) => {
  const { data } = await query<{ data: CollectionFiltersQuery }>(COLLECTION_FILTERS, variables)
  return data?.collection
}

export const collection = {
  get,
  getFilters,
}
