export default defineNuxtPlugin(async () => {
  const shopStore = useShopStore()
  const cartStore = useCartStore()

  await Promise.all([
    shopStore.getLocalization(),
    cartStore.getCart(),
  ])
})
