/**
 * Keeps Shopify analytics in sync with the cart.
 *
 * Cart events are derived by diffing the previous cart against the new one, so
 * every mutation just needs to hand the updated cart over with its lines
 * flattened out of the GraphQL connection.
 */
export default defineNuxtPlugin(() => {
  const cartStore = useCartStore()
  const analytics = useShopifyAnalytics()

  watch(
    () => cartStore.cart,
    (cart) => analytics.setCart(toAnalyticsCart(cart)),
    { immediate: true, deep: true },
  )
})
