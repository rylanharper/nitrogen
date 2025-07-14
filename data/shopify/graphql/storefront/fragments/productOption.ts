import { gql } from 'graphql-tag'

import { IMAGE_FRAGMENT } from './image'

export const PRODUCT_OPTION_FRAGMENT = gql`
  fragment ProductOption on ProductOption {
    id
    name
    optionValues {
      id
      name
      swatch {
        color
        image {
          alt
          id
          mediaContentType
          previewImage {
            ...Image
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
`
