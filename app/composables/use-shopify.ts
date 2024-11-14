import cart from '@@/server/operations/cart';
import collection from '@@/server/operations/collection';
import customer from '@@/server/operations/customer';
import localization from '@@/server/operations/localization';
import product from '@@/server/operations/product';
import search from '@@/server/operations/search';

/**
 * Provides access to GraphQL operations.
 * @returns An object with the Shopify operations (cart, collection, customer, etc.)
 */
export const useShopify = () => ({
  cart,
  collection,
  customer,
  localization,
  product,
  search
});
