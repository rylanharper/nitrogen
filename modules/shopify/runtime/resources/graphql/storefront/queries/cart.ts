import { gql } from 'graphql-tag'

import { CART_FRAGMENT } from '../fragments/cart'

export const CART = gql`
  query cart (
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cart (id: $id) {
      ...Cart
    }
  }
  ${CART_FRAGMENT}
`
