import { gql } from 'graphql-tag';

export const IMAGE_FRAGMENT = gql`
  fragment Image on Image {
    altText
    height
    id
    url
    width
  }
`;