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
    class="max-w-fit hover:text-gray-500"
  >
    <p v-if="colorOptionName" class="normal-case truncate ...">
      {{ product.title }} ({{ colorOptionName }})
    </p>
    <p v-else class="normal-case truncate ...">{{ product.title }}</p>
  </NuxtLink>
</template>
