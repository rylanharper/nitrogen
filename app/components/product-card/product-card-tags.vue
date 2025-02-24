<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

import { isNewItem, isSoldOut, isOnSale } from '@/helpers/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
}>();

// Computed
const NewItem = computed(() => isNewItem(props.product?.publishedAt));
const SoldOut = computed(() => isSoldOut(props.product));
const OnSale = computed(() => {
  const price = props.product?.priceRange?.minVariantPrice;
  const compareAtPrice = props.product?.compareAtPriceRange?.minVariantPrice;

  if (compareAtPrice) {
    return isOnSale(price, compareAtPrice);
  }

  return false;
});
</script>

<template>
  <div class="absolute flex gap-2 top-0 left-0 z-10 p-3 pointer-events-none">
    <span
      v-if="NewItem"
      class="px-2 py-0.5 max-w-fit uppercase text-sm bg-blue-50 text-blue-600 border border-blue-500 rounded"
    >
      New
    </span>
    <span
      v-if="SoldOut"
      class="px-2 py-0.5 max-w-fit uppercase text-sm bg-red-50 text-red-600 border border-red-500 rounded"
    >
      Sold Out
    </span>
    <span
      v-if="OnSale"
      class="px-2 py-0.5 max-w-fit uppercase text-sm bg-yellow-50 text-yellow-600 border border-yellow-500 rounded"
    >
      Sale
    </span>
  </div>
</template>
