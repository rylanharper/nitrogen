import { cart } from '../resources/operations/cart'
import { collection } from '../resources/operations/collection'
import { localization } from '../resources/operations/localization'
import { product } from '../resources/operations/product'
import { search } from '../resources/operations/search'
import { sitemap } from '../resources/operations/sitemap'

// Create composable
export const useShopify = () => ({
  cart,
  collection,
  localization,
  product,
  search,
  sitemap,
})
