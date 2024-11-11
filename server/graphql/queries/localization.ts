import { gql } from 'graphql-tag';

import { COUNTRY_FRAGMENT } from '../fragments/country';
import { LANGUAGE_FRAGMENT } from '../fragments/language';

export const LOCALIZATION = gql`
  query localization(
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    localization {
      availableLanguages {
        ...Language
      }
      availableCountries {
        ...Country
      }
      country {
        ...Country
      }
      language {
        ...Language
      }
    }
  }
  ${LANGUAGE_FRAGMENT}
  ${COUNTRY_FRAGMENT}
`;
