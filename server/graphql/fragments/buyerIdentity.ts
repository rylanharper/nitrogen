import { gql } from 'graphql-tag';
import { CUSTOMER_FRAGMENT } from './customer';

export const BUYER_IDENTITY_FRAGMENT = gql`
  fragment BuyerIdentity on CartBuyerIdentity {
    countryCode
    customer {
      ...Customer
    }
    email
    phone
  }
  ${CUSTOMER_FRAGMENT}
`;
