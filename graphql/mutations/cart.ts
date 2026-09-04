export const CART_CREATE = `#graphql
  mutation cartCreate(
    $input: CartInput
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      cart {
        ...Cart
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`

export const CART_LINES_ADD = `#graphql
  mutation cartLinesAdd(
    $cartId: ID!
    $lines: [CartLineInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`

export const CART_LINES_REMOVE = `#graphql
  mutation cartLinesRemove(
    $cartId: ID!
    $lineIds: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...Cart
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`

export const CART_LINES_UPDATE = `#graphql
  mutation cartLinesUpdate(
    $cartId: ID!
    $lines: [CartLineUpdateInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`

export const CART_BUYER_IDENTITY_UPDATE = `#graphql
  mutation cartBuyerIdentityUpdate(
    $buyerIdentity: CartBuyerIdentityInput!
    $cartId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
      cart {
        ...Cart
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`
