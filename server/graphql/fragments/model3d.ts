import { gql } from 'graphql-tag';

import { IMAGE_FRAGMENT } from './image';

export const MODEL_3D_FRAGMENT = gql`
  fragment Model3d on Model3d {
    alt
    id
    mediaContentType
    previewImage {
      ...Image
    }
    sources {
      filesize
      format
      mimeType
      url
    }
  }
  ${IMAGE_FRAGMENT}
`;
