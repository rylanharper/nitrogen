import type {
  ProductQuery,
  ProductQueryVariables,
  ProductRecommendationsQuery,
  ProductRecommendationsQueryVariables
} from '@@/types/shopify';

import { PRODUCT, RECOMMENDED_PRODUCTS } from '../../graphql/queries/product';
import { query } from '../../utils/graphql-client';

/**
 * Fetches a product based on the given options.
 * @param options - The variables for the product query (handle)
 * @returns A Promise resolving to the product data
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/product
 */
const get = async (
  options: ProductQueryVariables
): Promise<ProductQuery['product']> => {
  const response = await query(PRODUCT, options);
  return response.data?.product;
};

/**
 * Retrieves recommended products based on a reference product.
 * @param options - The variables for the recommendation query (handle)
 * @returns A Promise resolving to an array of recommended products
 * @see https://shopify.dev/docs/api/storefront/2024-10/queries/productRecommendations
 */
async function recommended(
  options: ProductRecommendationsQueryVariables
): Promise<ProductRecommendationsQuery['recommended']> {
  const response = await query(RECOMMENDED_PRODUCTS, options);
  return response.data?.recommended;
}

export default {
  get,
  recommended
};
