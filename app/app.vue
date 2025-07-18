<script setup lang="ts">
const shopStore = useShopStore()
const cartStore = useCartStore()

await Promise.all([
  shopStore.getLocalization(),
  cartStore.getCart(),
])

useHead({
  titleTemplate: (title) => title ? `${title} · Nitrogen` : 'Nitrogen: A Nuxt Shopify Template',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: '#181717' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
    { rel: 'preconnect', href: 'https://cdn.shopify.com' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})
</script>

<template>
  <AppHeader />
  <CartDrawer />
  <MobileMenu />
  <SearchMenu />
  <LocaleModal />

  <!-- Main -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <AppFooter />
</template>
