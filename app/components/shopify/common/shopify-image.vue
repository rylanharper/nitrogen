<script setup lang="ts">
import type { ImageFragment } from '@@/types/shopify-storefront';

import { formatImageUrl } from '@/utils/formatters';

// Props
const props = defineProps<{
  image?: ImageFragment | null;
  alt?: string;
  index?: number;
}>();

// Computed
const srcset = computed(() => {
  const url = props.image?.url;
  const sizes = [400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000];
  return sizes.map((size) => `${formatImageUrl(url, size)} ${size}w`).join(', ');
});

// Define image sizes
const sizes = `(min-width: 800px) 50vw, 100vw`;
</script>

<template>
  <figure
    class="relative w-full bg-gray-100"
    :style="{ paddingTop: `${(props.image?.height / props.image?.width) * 100}%` }"
  >
    <img
      :src="props.image?.url"
      :srcset="srcset"
      :sizes="sizes"
      :alt="props.image?.altText ? props.alt : 'Product image'"
      :loading="index === 0 ? 'eager' : 'lazy'"
      :fetch-priority="index === 0 ? 'high' : 'low'"
      decoding="async"
      class="absolute size-full inset-0 object-cover"
    />
  </figure>
</template>
