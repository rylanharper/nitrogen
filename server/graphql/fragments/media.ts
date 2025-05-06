import { gql } from 'graphql-tag';

import { MEDIA_IMAGE_FRAGMENT } from './mediaImage';
import { MODEL_3D_FRAGMENT } from './model3d';
import { VIDEO_FRAGMENT } from './video';

export const MEDIA_FRAGMENT = gql`
  fragment Media on Media {
    alt
    id
    mediaContentType
    previewImage {
      url
    }
    ... on MediaImage {
      ...MediaImage
    }
    ... on Model3d {
      ...Model3d
    }
    ... on Video {
      ...Video
    }
  }
  ${MEDIA_IMAGE_FRAGMENT}
  ${VIDEO_FRAGMENT}
  ${MODEL_3D_FRAGMENT}
`;
