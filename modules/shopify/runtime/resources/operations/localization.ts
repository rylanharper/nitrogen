import type {
  LocalizationQuery,
  LocalizationQueryVariables,
} from '@@/types/shopify-storefront'

import { LOCALIZATION } from '../graphql/storefront/queries/localization'
import { query } from '../utils/graphql-client'

/**
 * Fetches the localization data.
 * @param variables - The variables for the localization query (country, language)
 * @returns A Promise resolving to the localization data
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/localization
 */
export const get = async (
  variables: LocalizationQueryVariables,
): Promise<LocalizationQuery['localization']> => {
  const response = await query(LOCALIZATION, variables)
  return response.data?.localization
}

export default {
  get,
}
