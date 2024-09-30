<script setup lang="ts">
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
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>
