import {
  ProductQuery,
  ProductQueryVariables
} from '@@/types/shopify';

import { query } from '../utils/client';

import { PRODUCT } from '../graphql/queries/product';

/**
 * Fetches a product based on the given options.
 * @param options - The variables for the product query (handle)
 * @returns A Promise resolving to the product details
 * @see https://shopify.dev/docs/api/storefront/2024-07/queries/product
 */
async function get(
  options: ProductQueryVariables
): Promise<ProductQuery['product']> {
  const response = await query(PRODUCT, options);
  return response.data?.product;
}

export default {
  get
};
