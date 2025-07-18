import { gql } from 'graphql-tag'

import { FILTER_FRAGMENT } from '../fragments/filter'
import { IMAGE_FRAGMENT } from '../fragments/image'
import { PAGE_INFO_FRAGMENT } from '../fragments/pageInfo'
import { PRODUCT_SUMMARY_FRAGMENT } from '../fragments/productSummary'

export const COLLECTION = gql`
  query collection(
    $handle: String
    $first: Int
    $reverse: Boolean
    $sortKey: ProductCollectionSortKeys
    $filters: [ProductFilter!]
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      description
      descriptionHtml
      handle
      id
      image {
        ...Image
      }
      title
      trackingParameters
      updatedAt
      products(
        first: $first
        reverse: $reverse
        sortKey: $sortKey
        filters: $filters
      ) {
        filters {
          ...Filter
        }
        edges {
          node {
            ...ProductSummary
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${FILTER_FRAGMENT}
  ${PRODUCT_SUMMARY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`

export const COLLECTION_FILTERS = gql`
  query collectionFilters(
    $handle: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 250) {
        filters {
          ...Filter
        }
        edges {
          node {
            id
          }
        }
      }
    }
  }
  ${FILTER_FRAGMENT}
`
