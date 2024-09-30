import { gql } from 'graphql-tag';

export const MAILING_ADDRESS_FRAGMENT = gql`
  fragment MailingAddress on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    formatted
    formattedArea
    id
    lastName
    latitude
    longitude
    name
    phone
    province
    provinceCode
    zip
  }
`;
