<script setup lang="ts">
await Promise.all([
  useShopStore().getLocalization(),
  useCartStore().getCart()
])

useHead({
  titleTemplate: (title) => title ? `${title} · Nitrogen` : 'Nitrogen: A Nuxt Shopify Template',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: '#181717' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://cdn.shopify.com' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
});
</script>

<template>
  <div id="app" class="flex flex-col items-center">
    <app-header />
    <cart-drawer />
    <mobile-menu />
    <search-menu />
    <locale-modal />
    <main id="content" class="flex-1 min-h-svh w-full">
      <nuxt-layout>
        <nuxt-page />
      </nuxt-layout>
    </main>
  </div>
</template>

<style lang="css">
* {
  @apply font-mono uppercase;
}
</style>
