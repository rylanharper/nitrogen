import type {
  LocalizationQuery,
  LocalizationQueryVariables,
} from '@@/types/shopify-storefront'

import { LOCALIZATION } from '../graphql/storefront/queries/localization'
import { query } from '../graphql-client'

/**
 * Fetches the localization data.
 * @param variables - The variables for the localization query (country, language)
 * @returns A Promise resolving to the localization data
 * @see https://shopify.dev/docs/api/storefront/latest/queries/localization
 */
const get = async (variables: LocalizationQueryVariables) => {
  const { data } = await query<{ data: LocalizationQuery }>(LOCALIZATION, variables)
  return data?.localization
}

export const localization = {
  get,
}
