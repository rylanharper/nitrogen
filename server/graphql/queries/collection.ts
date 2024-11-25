import { gql } from 'graphql-tag';

import { FILTER_FRAGMENT } from '../fragments/filter';
import { IMAGE_FRAGMENT } from '../fragments/image';
import { PAGE_INFO_FRAGMENT } from '../fragments/pageInfo';
import { PRODUCT_FRAGMENT } from '../fragments/product';

export const COLLECTION = gql`
  query collection(
    $handle: String
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
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
        last: $last
        before: $startCursor
        after: $endCursor
        filters: $filters
        sortKey: $sortKey
        reverse: $reverse
      ) {
        filters {
          ...Filter
        }
        edges {
          node {
            ...Product
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${FILTER_FRAGMENT}
  ${PRODUCT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;
