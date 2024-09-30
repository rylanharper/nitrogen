import {
  CollectionQuery,
  CollectionQueryVariables
} from '@@/types/shopify';

import { query } from '../utils/client';

import { COLLECTION } from '../graphql/queries/collection';

/**
 * Fetches a collection based on the given options.
 * @param options - The variables for the collection query (handle, filters, etc.)
 * @returns A Promise resolving to the collection details
 * @see https://shopify.dev/docs/api/storefront/2024-07/queries/collection
 */
async function get(
  options: CollectionQueryVariables
): Promise<CollectionQuery> {
  const response = await query(COLLECTION, options);
  return response.data?.collection ?? response;
}

export default {
  get
};
