export const SITEMAP_COLLECTIONS = `#graphql
  query sitemapCollections($first: Int = 250) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`

export const SITEMAP_PRODUCTS = `#graphql
  query sitemapProducts($first: Int = 250) {
    products(first: $first, sortKey: TITLE) {
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`
