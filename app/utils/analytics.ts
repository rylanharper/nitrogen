import type {
  CartFragment,
  CartLineFragment,
  ProductFragment,
  ProductVariantFragment,
} from '#shopify/storefront'

/**
 * Maps a cart line to its analytics payload.
 * @param line - The cart line fragment
 */
export const toAnalyticsCartLine = (line: CartLineFragment) => ({
  id: line.id,
  quantity: line.quantity,
  merchandise: {
    id: line.merchandise.id,
    title: line.merchandise.title,
    sku: line.merchandise.sku ?? undefined,
    price: { amount: line.merchandise.price.amount },
    product: {
      id: line.merchandise.product.id,
      title: line.merchandise.product.title,
      vendor: line.merchandise.product.vendor,
    },
  },
})

/**
 * Maps a cart to its analytics payload.
 * @param cart - The cart fragment
 * @returns The payload, or null if there is no cart
 */
export const toAnalyticsCart = (cart: CartFragment | null | undefined) => {
  if (!cart?.id) return null

  return {
    id: cart.id,
    updatedAt: cart.updatedAt,
    totalQuantity: cart.totalQuantity,
    cost: {
      totalAmount: {
        amount: cart.cost.totalAmount.amount,
        currencyCode: cart.cost.totalAmount.currencyCode,
      },
    },
    lines: flattenConnection<CartLineFragment>(cart.lines).map(toAnalyticsCartLine),
  }
}

/**
 * Maps a product and variant to an analytics payload.
 * @param product - The product fragment
 * @param variant - The variant to attribute the view to
 * @returns The payload, or null if the product or variant is missing
 */
export const toAnalyticsProduct = (
  product: ProductFragment | null | undefined,
  variant: ProductVariantFragment | undefined,
) => {
  if (!product || !variant) return null

  return {
    id: product.id,
    title: product.title,
    vendor: product.vendor,
    price: variant.price.amount,
    variantId: variant.id,
    variantTitle: variant.title,
    productType: product.productType,
    sku: variant.sku ?? undefined,
  }
}
