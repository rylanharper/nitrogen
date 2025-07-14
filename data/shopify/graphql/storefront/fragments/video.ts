import { gql } from 'graphql-tag'

import { IMAGE_FRAGMENT } from './image'

export const VIDEO_FRAGMENT = gql`
  fragment Video on Video {
    alt
    id
    mediaContentType
    previewImage {
      ...Image
    }
    sources {
      format
      height
      mimeType
      url
      width
    }
  }
  ${IMAGE_FRAGMENT}
`
