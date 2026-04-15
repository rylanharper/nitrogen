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
import { query } from '../graphql-client'

/**
 * Fetches the product data.
 * @param variables - The variables for the product query (handle)
 * @returns A Promise resolving to the product data
 * @see https://shopify.dev/docs/api/storefront/latest/queries/product
 */
const get = async (variables: ProductQueryVariables) => {
  const { data } = await query<{ data: ProductQuery }>(PRODUCT, variables)
  return data?.product
}

/**
 * Fetches multiple products based on IDs.
 * @param variables - The variables for the products query (IDs)
 * @returns A Promise resolving to an array of products
 * @see https://shopify.dev/docs/api/storefront/latest/queries/nodes
 */
const getIds = async (variables: ProductIdsQueryVariables) => {
  const { data } = await query<{ data: ProductIdsQuery }>(PRODUCT_IDS, variables)
  return data?.nodes
}

/**
 * Fetches the recommended product data.
 * @param variables - The variables for the recommendation query (handle)
 * @returns A Promise resolving to an array of recommended products
 * @see https://shopify.dev/docs/api/storefront/latest/queries/productRecommendations
 */
const getRecommended = async (variables: ProductRecommendationsQueryVariables) => {
  const { data } = await query<{ data: ProductRecommendationsQuery }>(RECOMMENDED_PRODUCTS, variables)
  return data?.recommended
}

export const product = {
  get,
  getIds,
  getRecommended,
}
