import { gql } from 'graphql-tag';
import { LANGUAGE_FRAGMENT } from '../fragments/language';
import { COUNTRY_FRAGMENT } from '../fragments/country';

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
