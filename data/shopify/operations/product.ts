import type {
  ProductQuery,
  ProductQueryVariables,
  ProductIdsQuery,
  ProductIdsQueryVariables,
  ProductRecommendationsQuery,
  ProductRecommendationsQueryVariables,
} from '@@/types/shopify-storefront'

import {
  PRODUCT,
  PRODUCT_IDS,
  RECOMMENDED_PRODUCTS,
} from '../graphql/storefront/queries/product'
import { query } from '../utils/graphql-client'

/**
 * Fetches the product data.
 * @param options - The variables for the product query (handle)
 * @returns A Promise resolving to the product data
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/product
 */
const get = async (
  options: ProductQueryVariables,
): Promise<ProductQuery['product']> => {
  const response = await query(PRODUCT, options)
  return response.data?.product
}

/**
 * Fetches multiple products based on IDs.
 * @param options - The variables for the products query (IDs)
 * @returns A Promise resolving to an array of products
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/nodes
 */
const getIds = async (
  options: ProductIdsQueryVariables,
): Promise<ProductIdsQuery['nodes']> => {
  const response = await query(PRODUCT_IDS, options)
  return response.data?.nodes
}

/**
 * Fetches the recommended product data.
 * @param options - The variables for the recommendation query (handle)
 * @returns A Promise resolving to an array of recommended products
 * @see https://shopify.dev/docs/api/storefront/2024-10/queries/productRecommendations
 */
async function getRecommended(
  options: ProductRecommendationsQueryVariables,
): Promise<ProductRecommendationsQuery['recommended']> {
  const response = await query(RECOMMENDED_PRODUCTS, options)
  return response.data?.recommended
}

export default {
  get,
  getIds,
  getRecommended,
}
