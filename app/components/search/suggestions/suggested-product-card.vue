<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
}>();

// Helpers
const { getColorOption } = useShopifyHelpers();

// Computed
const colorOption = computed(() => getColorOption(props.product.options));
const colorOptionName = computed(() => colorOption.value?.optionValues[0]?.name);
</script>

<template>
  <NuxtLink
    :to="`/products/${product.handle}`"
    class="group flex gap-4"
  >
    <div class="aspect-square size-24 shrink-0 border border-transparent transition duration-200 group-hover:border-zinc-300">
      <ShopifyImage
        :image="product.featuredImage"
        :alt="product.featuredImage?.altText || product.title"
      />
    </div>
    <div class="flex flex-col">
      <div class="mb-2">
        <h2 v-if="product.title" class="uppercase">{{ product.title }}</h2>
        <h3 v-if="colorOption">{{ colorOptionName }}</h3>
      </div>
      <PriceDisplay
        :price="product.priceRange.minVariantPrice"
        :compare-at-price-range="product.compareAtPriceRange.minVariantPrice"
      />
    </div>
  </NuxtLink>
</template>
