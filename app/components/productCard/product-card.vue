<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
}>();

// Composables
const { getColorOption } = useProductHelpers();

// Computed
const productOptions = computed(() => props.product?.options);
const productOptionColor = computed(() => getColorOption(productOptions.value));
const colorOptionName = computed(() => productOptionColor.value?.optionValues[0]?.name);
</script>

<template>
  <nuxt-link
    :to="`/products/${product.handle}`"
    class="relative flex flex-col gap-4"
  >
    <product-card-tags :product="product" />
    <product-card-media :product="product" />
    <div class="flex flex-col">
      <div class="mb-2">
        <h2 v-if="product.title">{{ product.title }}</h2>
        <h3 v-if="productOptionColor" class="normal-case">
          {{ colorOptionName }}
        </h3>
      </div>
      <price-display
        :price="product.priceRange.minVariantPrice"
        :compare-at-price-range="product.compareAtPriceRange.minVariantPrice"
      />
    </div>
  </nuxt-link>
</template>
