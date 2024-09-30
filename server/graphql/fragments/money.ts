import { gql } from 'graphql-tag';

export const MONEY_FRAGMENT = gql`
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`;
