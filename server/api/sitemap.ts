import type { SitemapUrlInput } from '#sitemap/types'

// Composables
const shopify = useShopify()

/**
 * Generates sitemap URLs for the web app.
 * @returns An array of sitemap URL objects
 * @see https://nuxt.com/modules/sitemap
 */
export default defineSitemapEventHandler(async () => {
  const collections = await shopify.sitemap.getCollections({ first: 250 })
  const collectionUrls: SitemapUrlInput[] = collections.edges.map(({ node }) => ({
    loc: `/collections/${node.handle}`,
    lastmod: node.updatedAt,
  }))

  const products = await shopify.sitemap.getProducts({ first: 250 })
  const productUrls: SitemapUrlInput[] = products.edges.map(({ node }) => ({
    loc: `/products/${node.handle}`,
    lastmod: node.updatedAt,
  }))

  return [
    ...collectionUrls,
    ...productUrls,
    { loc: '/', lastmod: new Date(Date.now()) },
  ] satisfies SitemapUrlInput[]
})
