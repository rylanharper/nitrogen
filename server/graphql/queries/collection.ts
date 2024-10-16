import { gql } from 'graphql-tag';
import { IMAGE_FRAGMENT } from '../fragments/image';
import { FILTER_FRAGMENT } from '../fragments/filter';
import { PRODUCT_FRAGMENT } from '../fragments/product';
import { PAGE_INFO_FRAGMENT } from '../fragments/pageInfo';

export const COLLECTION = gql`
  query collection(
    $handle: String
    $country: CountryCode
    $language: LanguageCode
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
        first: 250
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
