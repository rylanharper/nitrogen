export const CART = `#graphql
  query cart (
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cart (id: $id) {
      ...Cart
    }
  }
`
