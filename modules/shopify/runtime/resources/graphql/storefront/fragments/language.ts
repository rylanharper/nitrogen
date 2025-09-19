import { gql } from 'graphql-tag'

export const LANGUAGE_FRAGMENT = gql`
  fragment Language on Language {
    endonymName
    isoCode
    name
  }
`
