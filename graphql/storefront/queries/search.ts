export const SEARCH = `#graphql
  query search(
    $query: String!
    $first: Int
    $reverse: Boolean
    $sortKey: SearchSortKeys
    $filters: [ProductFilter!]
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    search(
      query: $query
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
`

export const SEARCH_FILTERS = `#graphql
  query searchFilters(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    search(
      query: $query
      first: 250
      types: PRODUCT
    ) {
      filters: productFilters {
        ...Filter
      }
      edges {
        node {
          ... on Product {
            id
          }
        }
      }
    }
  }
`

export const PREDICTIVE_SEARCH = `#graphql
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
        options(first: 250) {
          ...ProductOption
        }
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
`
