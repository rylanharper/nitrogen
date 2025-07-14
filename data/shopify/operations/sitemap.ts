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
 * @param options - The variables for the collections query
 * @returns A Promise resolving to the collections data
 */
export const getCollections = async (
  options: SitemapCollectionsQueryVariables,
): Promise<SitemapCollectionsQuery['collections']> => {
  const response = await query(SITEMAP_COLLECTIONS, options)
  return response.data?.collections
}

/**
 * Fetches all products for the sitemap.
 * @param options - The variables for the products query
 * @returns A Promise resolving to the products data
 */
export const getProducts = async (
  options: SitemapProductsQueryVariables,
): Promise<SitemapProductsQuery['products']> => {
  const response = await query(SITEMAP_PRODUCTS, options)
  return response.data?.products
}

export default {
  getCollections,
  getProducts,
}
