import { gql } from 'graphql-tag'

import { FILTER_FRAGMENT } from '../fragments/filter'
import { IMAGE_FRAGMENT } from '../fragments/image'
import { PAGE_INFO_FRAGMENT } from '../fragments/pageInfo'
import { PRICE_RANGE_FRAGMENT } from '../fragments/priceRange'
import { PRODUCT_FRAGMENT } from '../fragments/product'

export const SEARCH = gql`
  query search(
    $searchTerm: String!
    $first: Int
    $reverse: Boolean
    $sortKey: SearchSortKeys
    $filters: [ProductFilter!]
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    search(
      query: $searchTerm
      first: $first
      reverse: $reverse
      sortKey: $sortKey
      productFilters: $filters
      types: PRODUCT
    ) {
      filters: productFilters {
        ...Filter
      }
      edges {
        node {
          ... on Product {
            ...Product
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
      totalCount
    }
  }
  ${FILTER_FRAGMENT}
  ${PRODUCT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`

export const SEARCH_FILTERS = gql`
  query searchFilters(
    $searchTerm: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    search(
      query: $searchTerm
      first: 250
      types: PRODUCT
    ) {
      filters: productFilters {
        ...Filter
      }
    }
  }
  ${FILTER_FRAGMENT}
`

export const PREDICTIVE_SEARCH = gql`
  query predictiveSearch(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      query: $query
      limit: 6
      types: [PRODUCT, COLLECTION, QUERY]
    ) {
      products {
        compareAtPriceRange {
          ...PriceRange
        }
        description
        featuredImage {
          ...Image
        }
        handle
        id
        priceRange {
          ...PriceRange
        }
        title
      }
      collections {
        handle
        id
        title
      }
      queries {
        text
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${PRICE_RANGE_FRAGMENT}
`
