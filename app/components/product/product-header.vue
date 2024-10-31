<script setup lang="ts">
import type { ProductFragment, ProductVariantFragment } from '@@/types/shopify';

const props = defineProps<{
  product: ProductFragment;
  currentVariant: ProductVariantFragment | undefined;
}>();
</script>

<template>
  <div class="flex flex-col gap-2 text-xl">
    <h1 class="normal-case tracking-tight leading-none">
      {{ product.title }}
    </h1>
    <price-display
      :price="currentVariant?.price ?? product.priceRange.minVariantPrice"
      :compareAtPriceRange="currentVariant?.compareAtPrice ?? product.compareAtPriceRange.minVariantPrice"
    />
  </div>
</template>
