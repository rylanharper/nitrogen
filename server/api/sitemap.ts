import type { SitemapUrlInput } from '#sitemap/types'

import { SITEMAP_COLLECTIONS, SITEMAP_PRODUCTS } from '@@/graphql/queries/sitemap'

/**
 * Generates sitemap URLs for the web app.
 * @returns An array of sitemap URL objects
 * @see https://nuxt.com/modules/sitemap
 */
export default defineSitemapEventHandler(async () => {
  const storefront = useStorefront()

  const { data: collectionsData } = await storefront.request(SITEMAP_COLLECTIONS, {
    variables: { first: 250 },
  })

  const collectionUrls: SitemapUrlInput[] = (collectionsData?.collections.edges ?? []).map(({ node }) => ({
    loc: `/collections/${node.handle}`,
    lastmod: node.updatedAt,
  }))

  const { data: productsData } = await storefront.request(SITEMAP_PRODUCTS, {
    variables: { first: 250 },
  })

  const productUrls: SitemapUrlInput[] = (productsData?.products.edges ?? []).map(({ node }) => ({
    loc: `/products/${node.handle}`,
    lastmod: node.updatedAt,
  }))

  return [
    ...collectionUrls,
    ...productUrls,
    { loc: '/', lastmod: new Date(Date.now()) },
  ] satisfies SitemapUrlInput[]
})
