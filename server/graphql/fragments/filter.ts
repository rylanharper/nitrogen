import { gql } from 'graphql-tag';
import { IMAGE_FRAGMENT } from './image';

export const FILTER_FRAGMENT = gql`
  fragment Filter on Filter {
    id
    label
    type
    values {
      count
      id
      label
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
`;
