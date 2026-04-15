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
import { query } from '../graphql-client'

/**
 * Fetches all collections for the sitemap.
 * @param variables - The variables for the collections query
 * @returns A Promise resolving to the collections data
 * @see https://shopify.dev/docs/api/storefront/latest/queries/collections
 */
export const getCollections = async (variables: SitemapCollectionsQueryVariables) => {
  const { data } = await query<{ data: SitemapCollectionsQuery }>(SITEMAP_COLLECTIONS, variables)
  return data?.collections
}

/**
 * Fetches all products for the sitemap.
 * @param variables - The variables for the products query
 * @returns A Promise resolving to the products data
 * @see https://shopify.dev/docs/api/storefront/latest/queries/products
 */
export const getProducts = async (variables: SitemapProductsQueryVariables) => {
  const { data } = await query<{ data: SitemapProductsQuery }>(SITEMAP_PRODUCTS, variables)
  return data?.products
}

export const sitemap = {
  getCollections,
  getProducts,
}
