import { gql } from 'graphql-tag'

import { BUYER_IDENTITY_FRAGMENT } from './buyerIdentity'
import { CART_LINE_FRAGMENT } from './cartLine'
import { MONEY_FRAGMENT } from './money'
import { PAGE_INFO_FRAGMENT } from './pageInfo'

export const CART_FRAGMENT = gql`
  fragment Cart on Cart {
    buyerIdentity {
      ...BuyerIdentity
    }
    checkoutUrl
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
    }
    createdAt
    id
    lines(first: 250) {
      edges {
        node {
          ...CartLine
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
    totalQuantity
    updatedAt
  }
  ${BUYER_IDENTITY_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
  ${CART_LINE_FRAGMENT}
`
