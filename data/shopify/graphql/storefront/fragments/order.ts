import { gql } from 'graphql-tag'

import { MAILING_ADDRESS_FRAGMENT } from './mailingAddress'
import { MONEY_FRAGMENT } from './money'
import { PRODUCT_VARIANT_FRAGMENT } from './productVariant'

export const ORDER_FRAGMENT = gql`
  fragment Order on Order {
    canceledAt
    currencyCode
    customerUrl
    edited
    email
    fulfillmentStatus
    id
    lineItems(first: 10) {
      edges {
        node {
          quantity
          title
          variant {
            ...ProductVariant
          }
        }
      }
    }
    name
    orderNumber
    processedAt
    shippingAddress {
      ...MailingAddress
    }
    statusUrl
    subtotalPrice {
      ...Money
    }
    totalPrice {
      ...Money
    },
    totalRefunded {
      ...Money
    }
    totalShippingPrice {
      ...Money
    }
    totalTax {
      ...Money
    }
  }
  ${MONEY_FRAGMENT}
  ${MAILING_ADDRESS_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`
