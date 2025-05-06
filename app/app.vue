<script setup lang="ts">
const shopStore = useShopStore();
const cartStore = useCartStore();

await Promise.all([
  shopStore.getLocalization(),
  cartStore.getCart()
]);

useHead({
  titleTemplate: (title) => title ? `${title} · Nitrogen` : 'Nitrogen: A Nuxt Shopify Template',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: '#181717' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
    { rel: 'preconnect', href: 'https://cdn.shopify.com' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
});
</script>

<template>
  <div id="app" class="flex flex-col">
    <AppHeader />
    <CartDrawer />
    <MobileMenu />
    <SearchMenu />
    <LocaleModal />
    <main role="main" class="flex-1 min-h-[calc(100svh-var(--header-height))]">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
    <AppFooter />
  </div>
</template>
