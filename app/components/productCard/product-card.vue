<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
}>();

// Helpers
const { getColorOption } = useProductHelpers();

// Computed
const options = computed(() => props.product?.options);
const colorOption = computed(() => getColorOption(options.value));
const colorOptionName = computed(() => colorOption.value?.optionValues[0]?.name);
const mediaItems = computed(() => flattenNodeConnection(props.product.media))
</script>

<template>
  <nuxt-link
    :to="`/products/${product.handle}`"
    class="relative flex flex-col gap-4"
  >
    <product-card-tags :product="product" />
    <product-card-media :mediaItems="mediaItems" />
    <div class="flex flex-col">
      <div class="mb-2">
        <h2 v-if="product.title">{{ product.title }}</h2>
        <h3 v-if="colorOption" class="normal-case">
          {{ colorOptionName }}
        </h3>
      </div>
      <price-display
        :price="product.priceRange.minVariantPrice"
        :compareAtPriceRange="product.compareAtPriceRange.minVariantPrice"
      />
    </div>
  </nuxt-link>
</template>
