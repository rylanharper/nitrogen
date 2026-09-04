export const PRODUCT = `#graphql
  query product(
    $handle: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product (handle: $handle) {
      ...Product
    }
  }
`

export const PRODUCT_IDS = `#graphql
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
`

export const RECOMMENDED_PRODUCTS = `#graphql
  query ProductRecommendations(
    $handle: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productHandle: $handle) {
      ...Product
    }
  }
`
