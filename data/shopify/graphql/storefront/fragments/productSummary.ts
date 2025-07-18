import { gql } from 'graphql-tag'

import { IMAGE_FRAGMENT } from './image'
import { MEDIA_FRAGMENT } from './media'
import { PRICE_RANGE_FRAGMENT } from './priceRange'
import { PRODUCT_OPTION_FRAGMENT } from './productOption'

export const PRODUCT_SUMMARY_FRAGMENT = gql`
  fragment ProductSummary on Product {
    availableForSale
    compareAtPriceRange {
      ...PriceRange
    }
    createdAt
    handle
    id
    media(first: 250) {
      edges {
        node {
          ...Media
        }
      }
    }
    options(first: 250) {
      ...ProductOption
    }
    priceRange {
      ...PriceRange
    }
    productType
    publishedAt
    tags
    title
    updatedAt
  }
  ${PRICE_RANGE_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MEDIA_FRAGMENT}
  ${PRODUCT_OPTION_FRAGMENT}
`
