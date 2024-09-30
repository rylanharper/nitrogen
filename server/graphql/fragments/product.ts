import { gql } from 'graphql-tag';
import { PRICE_RANGE_FRAGMENT } from './priceRange';
import { IMAGE_FRAGMENT } from './image';
import { MODEL_3D_FRAGMENT } from './model3d';
import { VIDEO_FRAGMENT } from './video';
import { PRODUCT_OPTION_FRAGMENT } from './productOption';
import { PRODUCT_VARIANT_FRAGMENT } from './productVariant';

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
    images(first: 250) {
      edges {
        node {
          ...Image
        }
      }
    }
    media(first: 250) {
      edges {
        node {
          alt
          id
          mediaContentType
          ... on Model3d {
            ...Model3d
          }
          ... on Video {
            ...Video
          }
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
    updatedAt
    variants(first: 250) {
      edges {
        node {
          ...ProductVariant
        }
      }
    }
  }
  ${PRICE_RANGE_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MODEL_3D_FRAGMENT}
  ${VIDEO_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${PRODUCT_OPTION_FRAGMENT}
`;
