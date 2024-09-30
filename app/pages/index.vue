<template>
  <div>
    <h1>Product Data</h1>
    <div v-if="data">
      <h2 class="text-2xl">{{ data?.title }}</h2>
    </div>
    <div v-else>Loading product data...</div>
  </div>
</template>

<script setup lang="ts">
const shopify = useShopify();

const { data, error } = await useAsyncData('product', () =>
  shopify.product.get({ handle: 'salomon-xt-4-og-black' })
);

if (error.value) console.error('Error:', error.value);
</script>
