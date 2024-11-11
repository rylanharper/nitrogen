<script setup lang="ts">
import type { ProductFragment, ProductVariantFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
  currentVariant: ProductVariantFragment | undefined;
}>();
</script>

<template>
  <div class="flex flex-col gap-2 text-xl">
    <h1 class="normal-case tracking-tight leading-none">
      {{ props.product.title }}
    </h1>
    <PriceDisplay
      :price="props.currentVariant?.price ?? props.product.priceRange.minVariantPrice"
      :compare-at-price-range="props.currentVariant?.compareAtPrice ?? props.product.compareAtPriceRange.minVariantPrice"
    />
  </div>
</template>
