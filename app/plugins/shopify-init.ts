/**
 * Initialize Shopify store data.
 */
export default defineNuxtPlugin({
  name: 'shopify-init',
  dependsOn: ['pinia-persist'],
  async setup() {
    const cartStore = useCartStore()
    const localeStore = useLocaleStore()

    await Promise.all([
      cartStore.getCart(),
      localeStore.getLocalization(),
    ])
  },
})
