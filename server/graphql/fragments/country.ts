import { gql } from 'graphql-tag';

export const COUNTRY_FRAGMENT = gql`
  fragment Country on Country {
    availableLanguages {
      endonymName
      isoCode
      name
    }
    currency {
      isoCode
      name
      symbol
    }
    isoCode
    name
    unitSystem
  }
`;
