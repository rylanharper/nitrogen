<script setup lang="ts">
import type { MoneyFragment } from '@@/types/shopify-storefront'

import { isOnSale } from '@/helpers/shopify'
import { formatCurrency } from '@/utils/formatters'

// Props
const props = defineProps<{
  price: MoneyFragment
  compareAtPriceRange?: MoneyFragment
}>()

// Computed
const price = computed(() =>
  props.price
    ? formatCurrency(props.price.amount, props.price.currencyCode)
    : null,
)
const OnSale = computed(() =>
  props.compareAtPriceRange && props.price
    ? isOnSale(props.price, props.compareAtPriceRange)
    : false,
)
const compareAtPrice = computed(() =>
  props.compareAtPriceRange
    ? formatCurrency(props.compareAtPriceRange.amount, props.compareAtPriceRange.currencyCode)
    : null,
)
</script>

<template>
  <div class="flex items-center gap-2">
    <span>{{ price }}</span>
    <span
      v-if="OnSale"
      class="text-zinc-500 line-through decoration-zinc-500"
    >
      {{ compareAtPrice }}
    </span>
  </div>
</template>
