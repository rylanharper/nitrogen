import { gql } from 'graphql-tag';

import { FILTER_FRAGMENT } from '../fragments/filter';
import { PAGE_INFO_FRAGMENT } from '../fragments/pageInfo';
import { PRODUCT_FRAGMENT } from '../fragments/product';

export const SEARCH = gql`
  query searchProducts(
    $searchTerm: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    search(
      query: $searchTerm
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      productFilters: $filters
      sortKey: $sortKey
      reverse: $reverse
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
`;

export const PREDICTIVE_SEARCH = gql`
  query predictiveSearch(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(query: $query, limit: 6, types: PRODUCT) {
      products {
        ...Product
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;
