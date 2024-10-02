import {
  SearchProductsQuery,
  SearchProductsQueryVariables,
  PredictiveSearchQuery,
  PredictiveSearchQueryVariables
} from '@@/types/shopify';

import { query } from '../utils/client';

import { SEARCH, PREDICTIVE_SEARCH } from '../graphql/queries/search';

/**
 * Executes a product search based on the given options.
 * @param options - The variables for the search query (query, filters, etc.)
 * @returns A Promise resolving to the search results
 * @see https://shopify.dev/docs/api/storefront/2024-07/queries/search
 */
async function products(
  options: SearchProductsQueryVariables
): Promise<SearchProductsQuery['search']> {
  const response = await query(SEARCH, options);
  return response.data?.search;
}

/**
 * Executes a predictive search for collections and products.
 * @param options - The variables for the predictive search query (query)
 * @returns A Promise resolving to the predictive search results
 * @see https://shopify.dev/docs/api/storefront/2024-07/queries/predictiveSearch
 */
async function predictive(
  options: PredictiveSearchQueryVariables
): Promise<PredictiveSearchQuery['predictiveSearch']> {
  const response = await query(PREDICTIVE_SEARCH, options);
  return response.data?.predictiveSearch;
}

export default {
  products,
  predictive
};
