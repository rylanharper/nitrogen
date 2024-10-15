import { gql } from 'graphql-tag';

export const PRICE_RANGE_FRAGMENT = gql`
  fragment PriceRange on ProductPriceRange {
    maxVariantPrice {
      amount
      currencyCode
    }
    minVariantPrice {
      amount
      currencyCode
    }
  }
`;
