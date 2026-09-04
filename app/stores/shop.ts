import type {
  CountryCode,
  LanguageCode,
  LocalizationQuery,
} from '#shopify/storefront'

import { LOCALIZATION } from '@@/graphql/queries/localization'
import { defineStore } from 'pinia'

// Types
type Localization = LocalizationQuery['localization']

// Interface
// The buyer's country/language start out as bare ISO codes and are filled in
// once `getLocalization` resolves them against Shopify
interface ShopState {
  locale: Omit<Localization, 'country' | 'language'> & {
    country: Partial<Localization['country']>
    language: Partial<Localization['language']>
  }
}

// Store
export const useShopStore = defineStore('@nikkoel/shop', {
  state: (): ShopState => ({
    locale: {
      availableCountries: [],
      availableLanguages: [],
      country: {
        isoCode: 'US',
      },
      language: {
        isoCode: 'EN',
      },
    },
  }),

  actions: {
    /**
     * Fetches localization data from Shopify and updates the store.
     * @param newCountryCode - Optional country code input
     * @param newLanguageCode - Optional language code input
     */
    async getLocalization(newCountryCode?: CountryCode, newLanguageCode?: LanguageCode) {
      try {
        const { data } = await useStorefront().request(LOCALIZATION, {
          variables: {
            country: newCountryCode ?? this.locale.country.isoCode,
            language: newLanguageCode ?? this.locale.language.isoCode,
          },
        })

        const response = data!.localization

        if (!response.country && !response.language) {
          throw new Error('No localization data found.')
        }

        this.locale.availableCountries = response.availableCountries
        this.locale.availableLanguages = response.availableLanguages
        this.locale.country = response.country
        this.locale.language = response.language
      } catch (error) {
        console.error('Connot get localization data:', error)
        throw error
      }
    },
  },

  getters: {
    buyerCountryCode: (state) => state.locale?.country?.isoCode,
    buyerCurrencyCode: (state) => state.locale?.country?.currency?.isoCode,
    buyerCurrencySymbol: (state) => state.locale?.country?.currency?.symbol,
    buyerLanguageCode: (state) => state.locale?.language?.isoCode,
  },

  persist: {
    pick: ['locale.country', 'locale.language'],
    storage: piniaPluginPersistedstate.cookies({
      sameSite: 'lax',
      secure: !import.meta.dev,
      maxAge: 60 * 60 * 24 * 365, // 1 year
    }),
  },
})
