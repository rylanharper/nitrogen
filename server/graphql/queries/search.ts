import { gql } from 'graphql-tag';
import { FILTER_FRAGMENT } from '../fragments/filter';
import { PRODUCT_FRAGMENT } from '../fragments/product';
import { PAGE_INFO_FRAGMENT } from '../fragments/pageInfo';

export const SEARCH = gql`
  query searchProducts(
    $searchTerm: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    search(
      first: 250
      query: $searchTerm
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
    predictiveSearch(query: $query, limit: 6, unavailableProducts: HIDE) {
      products {
        ...Product
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;
