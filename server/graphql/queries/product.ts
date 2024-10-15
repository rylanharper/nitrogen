import { gql } from 'graphql-tag';
import { PRODUCT_FRAGMENT } from '../fragments/product';

export const PRODUCT = gql`
  query product (
    $handle: String
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product (handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;
