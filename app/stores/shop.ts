import type {
  CountryCode,
  LanguageCode,
  LocalizationQuery,
} from '@@/types/shopify-storefront'

import { defineStore } from 'pinia'

// Interface
interface ShopState {
  locale: LocalizationQuery['localization']
}

// Composables
const shopify = useShopify()

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
        const response = await shopify.localization.get({
          country: newCountryCode ?? this.locale.country.isoCode,
          language: newLanguageCode ?? this.locale.language.isoCode,
        })

        if (!response.country && !response.language) {
          throw new Error('No localization data found.')
        }

        this.locale.availableCountries = response.availableCountries
        this.locale.availableLanguages = response.availableLanguages
        this.locale.country = response.country
        this.locale.language = response.language
      } catch (error: any) {
        console.error('Connot get localization data:', error.message)
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
  },
})
