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
      <div class="flex flex-col gap-2 text-xl">
        <h1 class="normal-case tracking-tight leading-none">
          {{ product.title }}
        </h1>
        <price-display
          :price="product.priceRange.minVariantPrice"
          :compareAtPriceRange="product.compareAtPriceRange.minVariantPrice"
        />
      </div>
      <product-swatches
        :options="product.options"
        :relatedProducts="relatedProducts"
      />
      <!-- TODO -->
    </div>
  </div>
</template>
