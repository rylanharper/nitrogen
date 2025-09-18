import { gql } from 'graphql-tag'

export const SITEMAP_COLLECTIONS = gql`
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

export const SITEMAP_PRODUCTS = gql`
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
