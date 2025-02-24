import cart from '@@/server/operations/shopify/cart';
import collection from '@@/server/operations/shopify/collection';
import customer from '@@/server/operations/shopify/customer';
import localization from '@@/server/operations/shopify/localization';
import product from '@@/server/operations/shopify/product';
import search from '@@/server/operations/shopify/search';

export const useShopify = () => ({
  cart,
  collection,
  customer,
  localization,
  product,
  search
});
