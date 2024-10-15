import { gql } from 'graphql-tag';

export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfo on PageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
`;
