<script setup lang="ts">
import type { MoneyFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  price?: MoneyFragment | null;
  compareAtPriceRange?: MoneyFragment;
}>();

// Helpers
const helpers = useShopifyHelpers();

// Computed
const price = computed(() =>
  props.price ? formatCurrency(props.price.amount, props.price.currencyCode) : ''
);
const OnSale = computed(() =>
  props.compareAtPriceRange && props.price
    ? helpers.isOnSale(props.price, props.compareAtPriceRange)
    : false
);
const compareAtPrice = computed(() =>
  props.compareAtPriceRange
    ? formatCurrency(props.compareAtPriceRange.amount, props.compareAtPriceRange.currencyCode)
    : null
);
</script>

<template>
  <div class="flex items-center gap-2">
    <span>{{ price }}</span>
    <span v-if="OnSale" class="text-zinc-500 line-through decoration-zinc-500">
      {{ compareAtPrice }}
    </span>
  </div>
</template>
