import type {
  SitemapCollectionsQuery,
  SitemapCollectionsQueryVariables,
  SitemapProductsQuery,
  SitemapProductsQueryVariables,
} from '@@/types/shopify-storefront'

import {
  SITEMAP_COLLECTIONS,
  SITEMAP_PRODUCTS,
} from '../graphql/storefront/queries/sitemap'
import { query } from '../utils/graphql-client'

/**
 * Fetches all collections for the sitemap.
 * @param variables - The variables for the collections query
 * @returns A Promise resolving to the collections data
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/collections
 */
export const getCollections = async (
  variables: SitemapCollectionsQueryVariables,
): Promise<SitemapCollectionsQuery['collections']> => {
  const response = await query(SITEMAP_COLLECTIONS, variables)
  return response.data?.collections
}

/**
 * Fetches all products for the sitemap.
 * @param variables - The variables for the products query
 * @returns A Promise resolving to the products data
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/products
 */
export const getProducts = async (
  variables: SitemapProductsQueryVariables,
): Promise<SitemapProductsQuery['products']> => {
  const response = await query(SITEMAP_PRODUCTS, variables)
  return response.data?.products
}

export default {
  getCollections,
  getProducts,
}
