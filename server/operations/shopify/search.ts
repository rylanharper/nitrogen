import type {
  SearchProductsQuery,
  SearchProductsQueryVariables,
  PredictiveSearchQuery,
  PredictiveSearchQueryVariables
} from '@@/types/shopify';

import { SEARCH, PREDICTIVE_SEARCH } from '../../graphql/queries/search';
import { query } from '../../utils/graphql-client';


/**
 * Executes a product search based on the given options.
 * @param options - The variables for the search query (query, filters, etc.)
 * @returns A Promise resolving to the search results
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/search
 */
const products = async (
  options: SearchProductsQueryVariables
): Promise<SearchProductsQuery['search']> => {
  const response = await query(SEARCH, options) as { data: SearchProductsQuery };
  return response.data?.search;
};

/**
 * Executes a predictive search for collections and products.
 * @param options - The variables for the predictive search query (query)
 * @returns A Promise resolving to the predictive search results
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/predictiveSearch
 */
const predictive = async (
  options: PredictiveSearchQueryVariables
): Promise<PredictiveSearchQuery['predictiveSearch']> => {
  const response = await query(PREDICTIVE_SEARCH, options) as { data?: PredictiveSearchQuery };
  return response.data?.predictiveSearch;
};

export default {
  products,
  predictive
};
