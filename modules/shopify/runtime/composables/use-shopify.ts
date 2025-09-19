import cart from '../resources/operations/cart'
import collection from '../resources/operations/collection'
import customer from '../resources/operations/customer'
import localization from '../resources/operations/localization'
import product from '../resources/operations/product'
import search from '../resources/operations/search'
import sitemap from '../resources/operations/sitemap'

export const useShopify = () => ({
  cart,
  collection,
  customer,
  localization,
  product,
  search,
  sitemap,
})
