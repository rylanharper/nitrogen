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
import { query } from '../utils/graphql-client'

/**
 * Fetches the search data.
 * @param options - The variables for the search query (query, filters, etc.)
 * @returns A Promise resolving to the search results
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/search
 */
const get = async (
  options: SearchQueryVariables,
): Promise<SearchQuery['search']> => {
  const response = await query(SEARCH, options)
  return response.data?.search
}

/**
 * Fetches the search filter data.
 * @param options - The variables for the search query (query)
 * @returns A Promise resolving to the search results
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/search
 */
const getFilters = async (
  options: SearchFiltersQueryVariables,
): Promise<SearchFiltersQuery['search']> => {
  const response = await query(SEARCH_FILTERS, options)
  return response.data?.search
}

/**
 * Fetches the predictive search data.
 * @param options - The variables for the predictive search query (query)
 * @returns A Promise resolving to the predictive search results
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/predictiveSearch
 */
const getPredictive = async (
  options: PredictiveSearchQueryVariables,
): Promise<PredictiveSearchQuery['predictiveSearch']> => {
  const response = await query(PREDICTIVE_SEARCH, options)
  return response.data?.predictiveSearch
}

export default {
  get,
  getPredictive,
  getFilters,
}
