export const COLLECTION = `#graphql
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
`

export const COLLECTION_FILTERS = `#graphql
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
`
