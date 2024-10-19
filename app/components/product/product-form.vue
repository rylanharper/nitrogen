<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
  relatedProducts: ProductFragment[]
}>();
</script>

<template>
  <div class="relative lg:sticky lg:top-[calc(var(--header-height)+1px)]">
    <div class="flex flex-col gap-4 w-full lg:md:max-w-lg lg:pt-20 lg:mx-auto">
      <span class="text-sm">{{ product.tags[0] }}</span>
      <div class="flex flex-col gap-1">
        <h1 class="normal-case text-2xl tracking-tight leading-none">
          {{ product.title }}
        </h1>
        <price-display
          :price="product.priceRange.minVariantPrice"
          :compare-at-price-range="product.compareAtPriceRange.minVariantPrice"
          class="text-2xl"
        />
      </div>
    </div>
  </div>
</template>
