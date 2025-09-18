import { gql } from 'graphql-tag'

import { IMAGE_FRAGMENT } from './image'
import { MEDIA_FRAGMENT } from './media'
import { PRICE_RANGE_FRAGMENT } from './priceRange'
import { PRODUCT_OPTION_FRAGMENT } from './productOption'
import { PRODUCT_VARIANT_FRAGMENT } from './productVariant'

export const PRODUCT_FRAGMENT = gql`
  fragment Product on Product {
    availableForSale
    compareAtPriceRange {
      ...PriceRange
    }
    createdAt
    description
    descriptionHtml
    featuredImage {
      ...Image
    }
    handle
    id
    isGiftCard
    media(first: 250) {
      edges {
        node {
          ...Media
        }
      }
    }
    onlineStoreUrl
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
    totalInventory
    trackingParameters
    updatedAt
    variants(first: 250) {
      edges {
        node {
          ...ProductVariant
        }
      }
    }

    # Custom product metafields
    filter_color: metafield(namespace: "custom", key: "filter_color") {
      key
      value
      references(first: 10) {
        edges {
          node {
            ... on Metaobject {
              fields {
                key
                value
              }
              handle
              id
            }
          }
        }
      }
    }
    matching_colors: metafield(namespace: "custom", key: "matching_colors") {
      key
      value
      references(first: 10) {
        edges {
          node {
            ...on Product {
              availableForSale
              handle
              id
              options(first: 250) {
                ...ProductOption
              }
            }
          }
        }
      }
    }
    details: metafield(namespace: "custom", key: "details") {
      key
      value
    }
    shipping: metafield(namespace: "custom", key: "shipping") {
      key
      value
    }
  }
  ${PRICE_RANGE_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MEDIA_FRAGMENT}
  ${PRODUCT_OPTION_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`
