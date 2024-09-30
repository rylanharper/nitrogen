import { gql } from 'graphql-tag';
import { BUYER_IDENTITY_FRAGMENT } from './buyerIdentity';
import { MONEY_FRAGMENT } from './money';
import { PAGE_INFO_FRAGMENT } from './pageInfo';
import { CART_LINE_FRAGMENT } from './cartLine';

export const CART_FRAGMENT = gql`
  fragment Cart on Cart {
    attributes {
      key
      value
    }
    buyerIdentity {
      ...BuyerIdentity
    }
    checkoutUrl
    cost {
      totalAmount {
        ...Money
      }
      subtotalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
    }
    createdAt
    discountCodes {
      applicable
      code
    }
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
`;
