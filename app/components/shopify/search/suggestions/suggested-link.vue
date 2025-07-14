<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify-storefront';

import { getColorOption } from '@/helpers/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
}>();

// Computed
const colorOption = computed(() => getColorOption(props.product.options));
const colorOptionName = computed(() => colorOption.value?.optionValues[0]?.name);
</script>

<template>
  <NuxtLink
    :to="`/products/${product.handle}`"
    class="max-w-fit hover:text-gray-500"
  >
    <p v-if="colorOptionName" class="truncate ...">
      {{ product.title }} ({{ colorOptionName }})
    </p>
    <p v-else class="truncate ...">{{ product.title }}</p>
  </NuxtLink>
</template>
