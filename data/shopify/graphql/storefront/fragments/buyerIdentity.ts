import { gql } from 'graphql-tag'

import { MAILING_ADDRESS_FRAGMENT } from './mailingAddress'

export const BUYER_IDENTITY_FRAGMENT = gql`
  fragment BuyerIdentity on CartBuyerIdentity {
    countryCode
    customer {
      defaultAddress {
        ...MailingAddress
      }
      displayName
      email
      id
    }
    email
    phone
  }
  ${MAILING_ADDRESS_FRAGMENT}
`
