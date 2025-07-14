import { gql } from 'graphql-tag'

import { PRODUCT_FRAGMENT } from '../fragments/product'

export const PRODUCT = gql`
  query product(
    $handle: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product (handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const PRODUCT_IDS = gql`
  query productIds(
    $ids: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      ... on Product {
        ...Product
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`

export const RECOMMENDED_PRODUCTS = gql`
  query ProductRecommendations(
    $handle: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productHandle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`
