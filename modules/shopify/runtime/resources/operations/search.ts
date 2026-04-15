import type {
  SearchQuery,
  SearchQueryVariables,
  SearchFiltersQuery,
  SearchFiltersQueryVariables,
  PredictiveSearchQuery,
  PredictiveSearchQueryVariables,
} from '@@/types/shopify-storefront'

import {
  SEARCH,
  SEARCH_FILTERS,
  PREDICTIVE_SEARCH,
} from '../graphql/storefront/queries/search'
import { query } from '../graphql-client'

/**
 * Fetches the search data.
 * @param options - The variables for the search query (query, filters, etc.)
 * @returns A Promise resolving to the search results
 * @see https://shopify.dev/docs/api/storefront/latest/queries/search
 */
const get = async (options: SearchQueryVariables) => {
  const { data } = await query<{ data: SearchQuery }>(SEARCH, options)
  return data?.search
}

/**
 * Fetches the search filter data.
 * @param options - The variables for the search query (query)
 * @returns A Promise resolving to the search results
 * @see https://shopify.dev/docs/api/storefront/latest/queries/search
 */
const getFilters = async (options: SearchFiltersQueryVariables) => {
  const { data } = await query<{ data: SearchFiltersQuery }>(SEARCH_FILTERS, options)
  return data?.search
}

/**
 * Fetches the predictive search data.
 * @param options - The variables for the predictive search query (query)
 * @returns A Promise resolving to the predictive search results
 * @see https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
 */
const getPredictive = async (options: PredictiveSearchQueryVariables) => {
  const { data } = await query<{ data: PredictiveSearchQuery }>(PREDICTIVE_SEARCH, options)
  return data?.predictiveSearch
}

export const search = {
  get,
  getFilters,
  getPredictive,
}
