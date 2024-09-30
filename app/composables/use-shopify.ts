import cart from '@@/server/operations/cart';
import collection from '@@/server/operations/collection';
import customer from '@@/server/operations/customer';
import localization from '@@/server/operations/localization';
import product from '@@/server/operations/product';
import search from '@@/server/operations/search';

export function useShopify() {
  return {
    cart,
    collection,
    customer,
    localization,
    product,
    search
  };
}
