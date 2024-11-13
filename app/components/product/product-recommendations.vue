<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  products: ProductFragment[];
}>();
</script>

<template>
  <div class="relative flex flex-col gap-8">
    <h2 class="normal-case text-xl tracking-tight leading-none">
      You May Also Like
    </h2>
    <div
      v-if="props.products && props.products.length"
      class="grid grid-cols-2 auto-rows-fr gap-x-6 gap-y-8 w-full mb-8 lg:grid-cols-4 lg:gap-y-12"
    >
      <div
        v-for="product in products"
        :key="product.id"
      >
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>
