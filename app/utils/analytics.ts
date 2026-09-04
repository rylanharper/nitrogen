import type { CartFragment, CartLineFragment, ProductFragment, ProductVariantFragment } from '#shopify/storefront'

/**
 * Maps a cart line onto the payload Shopify analytics expects.
 * @param line - The cart line fragment
 * @returns The analytics cart line
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
 * Maps a cart onto the payload Shopify analytics expects, flattening its lines.
 * @param cart - The cart fragment
 * @returns The analytics cart, or null when there is no cart yet
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
 * Maps a product and its selected variant onto the payload Shopify analytics expects.
 * @param product - The product fragment
 * @param variant - The variant to attribute the view to
 * @returns The analytics product, or null when there is no variant to price it with
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
