<script setup lang="ts">
import type { ImageFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  image?: ImageFragment | null | undefined;
  alt?: string;
  height?: number;
  width?: number;
  index?: number;
}>();

// Computed
const srcset = computed(() => {
  const imageUrl = props.image?.url;
  const sizes = [400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000];
  return sizes.map((size) => `${formatSizeUrl(imageUrl, size)} ${size}w`).join(', ');
});

// Define image sizes
const sizes = `(min-width: 800px) 50vw, 100vw`;
</script>

<template>
  <figure class="relative w-full bg-gray-100">
    <img
      :src="props.image?.url"
      :srcset="srcset"
      :sizes="sizes"
      :height="props.height ?? 100"
      :width="props.width ?? 100"
      :alt="props.image?.altText ? props.alt : 'Product image'"
      :loading="index === 0 ? 'eager' : 'lazy'"
      :fetch-priority="index === 0 ? 'high' : 'auto'"
      decoding="async"
      class="size-full object-cover"
    />
  </figure>
</template>
