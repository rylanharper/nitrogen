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
 * @param variables - The variables for the product query (handle)
 * @returns A Promise resolving to the product data
 * @see https://shopify.dev/docs/api/storefront/latest/queries/product
 */
const get = async (
  variables: ProductQueryVariables,
): Promise<ProductQuery['product']> => {
  const response = await query(PRODUCT, variables)
  return response.data?.product
}

/**
 * Fetches multiple products based on IDs.
 * @param variables - The variables for the products query (IDs)
 * @returns A Promise resolving to an array of products
 * @see https://shopify.dev/docs/api/storefront/latest/queries/nodes
 */
const getIds = async (
  variables: ProductIdsQueryVariables,
): Promise<ProductIdsQuery['nodes']> => {
  const response = await query(PRODUCT_IDS, variables)
  return response.data?.nodes
}

/**
 * Fetches the recommended product data.
 * @param variables - The variables for the recommendation query (handle)
 * @returns A Promise resolving to an array of recommended products
 * @see https://shopify.dev/docs/api/storefront/latest/queries/productRecommendations
 */
async function getRecommended(
  variables: ProductRecommendationsQueryVariables,
): Promise<ProductRecommendationsQuery['recommended']> {
  const response = await query(RECOMMENDED_PRODUCTS, variables)
  return response.data?.recommended
}

export default {
  get,
  getIds,
  getRecommended,
}
