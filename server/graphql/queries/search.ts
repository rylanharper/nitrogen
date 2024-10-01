import { gql } from 'graphql-tag';
import { FILTER_FRAGMENT } from '../fragments/filter';
import { PRODUCT_FRAGMENT } from '../fragments/product';
import { PAGE_INFO_FRAGMENT } from '../fragments/pageInfo';
import { IMAGE_FRAGMENT } from '../fragments/image';
import { PRICE_RANGE_FRAGMENT } from '../fragments/priceRange';
import { PRODUCT_OPTION_FRAGMENT } from '../fragments/productOption';

export const SEARCH = gql`
  query search(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: SearchSortKeys!
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query
      first: 250
      types: PRODUCT
      productFilters: $filters
      sortKey: $sortKey
      reverse: $reverse
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
      collections {
        __typename
        handle
        id
        image {
          ...Image
        }
        title
        trackingParameters
      }
      products {
        __typename
        featuredImage {
          ...Image
        }
        handle
        id
        title
        trackingParameters
        options(first: 250) {
          ...ProductOption
        }
        priceRange {
          ...PriceRange
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${PRICE_RANGE_FRAGMENT}
  ${PRODUCT_OPTION_FRAGMENT}
`;
