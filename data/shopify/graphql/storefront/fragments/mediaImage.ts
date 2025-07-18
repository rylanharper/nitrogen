import { gql } from 'graphql-tag'

import { IMAGE_FRAGMENT } from './image'

export const MEDIA_IMAGE_FRAGMENT = gql`
  fragment MediaImage on MediaImage {
    alt
    id
    image {
      ...Image
    }
    mediaContentType
    previewImage {
      ...Image
    }
  }
  ${IMAGE_FRAGMENT}
`
