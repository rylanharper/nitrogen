import { gql } from 'graphql-tag'

import { MAILING_ADDRESS_FRAGMENT } from './mailingAddress'
import { ORDER_FRAGMENT } from './order'
import { PRODUCT_FRAGMENT } from './product'

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
    }
    phone
    tags
    updatedAt

    # Custom customer metafields
    wishlist: metafield(namespace: "custom", key: "wishlist") {
      namespace
      key
      type
      updatedAt
      references(first: 100) {
        edges {
          node {
            ... on Product {
              ...Product
            }
          }
        }
      }
    }
  }
  ${MAILING_ADDRESS_FRAGMENT}
  ${ORDER_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`
