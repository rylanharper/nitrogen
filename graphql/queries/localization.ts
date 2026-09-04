export const LOCALIZATION = `#graphql
  query localization(
    $country: CountryCode
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
`
