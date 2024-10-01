<script setup lang="ts">
await Promise.all([
  useShopStore().fetchLocalizationData(),
  useCartStore().retrieveCart()
])

useHead({
  titleTemplate: (title) => title ? `${title} · Nitrogen` : 'Nitrogen: A Nuxt Shopify Template',
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
