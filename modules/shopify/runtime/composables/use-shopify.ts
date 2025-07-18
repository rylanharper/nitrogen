import cart from '@@/data/shopify/operations/cart'
import collection from '@@/data/shopify/operations/collection'
import customer from '@@/data/shopify/operations/customer'
import localization from '@@/data/shopify/operations/localization'
import product from '@@/data/shopify/operations/product'
import search from '@@/data/shopify/operations/search'
import sitemap from '@@/data/shopify/operations/sitemap'

export const useShopify = () => ({
  cart,
  collection,
  customer,
  localization,
  product,
  search,
  sitemap,
})
