<script setup lang="ts">
import type { ImageFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  image?: ImageFragment | null;
  alt?: string;
  index?: number;
}>();

// Computed
// const srcset = computed(() => {
//   const imageUrl = props.image?.url;
//   const sizes = [400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400];
//   return sizes.map((size) => `${formatSizeUrl(imageUrl, size)} ${size}w`).join(', ');
// });

// Define image sizes
// const sizes = `(min-width: 1000px) 60vw, 100vw`;
</script>

<template>
  <figure class="relative size-full bg-gray-100">
    <NuxtImg
      :src="image?.url"
      :alt="image?.altText ?? props.alt"
      class="absolute size-full inset-0 object-cover"
      :loading="index === 0 ? 'eager' : 'lazy'"
      :fetch-priority="index === 0 ? 'high' : 'low'"
      :preload="index === 0 ? true : false"
      decoding="async"
    />
  </figure>
</template>
