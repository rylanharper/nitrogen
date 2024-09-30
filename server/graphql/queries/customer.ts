import { gql } from 'graphql-tag';
import { CUSTOMER_FRAGMENT } from '../fragments/customer';

export const CUSTOMER = gql`
  query customer (
    $customerAccessToken: String!
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer (customerAccessToken: $customerAccessToken) {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
`;
