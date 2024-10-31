import { gql } from 'graphql-tag';
import { MAILING_ADDRESS_FRAGMENT } from './mailingAddress';
import { ORDER_FRAGMENT } from './order';

export const CUSTOMER_FRAGMENT = gql`
  fragment Customer on Customer {
    acceptsMarketing
    addresses(first: 250) {
      edges  {
        node {
          ...MailingAddress
        }
      }
    }
    createdAt
    defaultAddress {
      ...MailingAddress
    }
    displayName
    email
    firstName
    id
    lastName
    numberOfOrders
    orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          ...Order
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
    phone
    tags
    updatedAt
  }
  ${MAILING_ADDRESS_FRAGMENT}
  ${ORDER_FRAGMENT}
`;
