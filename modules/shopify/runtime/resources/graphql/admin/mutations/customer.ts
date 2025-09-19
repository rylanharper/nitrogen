import { gql } from 'graphql-tag'

export const CUSTOMER_UPDATE_METAFIELDS = gql`
  mutation customerUpdate(
    $input: CustomerInput!
  ) {
    customerUpdate(input: $input) {
      customer {
        id
        metafields(first: 10) {
          edges {
            node {
              id
              key
              namespace
              value
            }
          }
        }
      }
      userErrors {
        message
        field
      }
    }
  }
`
