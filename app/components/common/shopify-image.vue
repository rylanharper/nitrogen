<script setup lang="ts">
import type { ImageFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  image: ImageFragment | null | undefined;
  alt: string;
}>();

// Computed
// eslint-disable-next-line vue/return-in-computed-property
const srcset = computed(() => {
  if (props.image?.url.includes('cdn.shopify.com')) {
    const sizes = [400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200];

    return sizes
      .map((width) => `${formatSizeUrl(props.image?.url, width)} ${width}w`)
      .join(', ');
  }
});
</script>

<template>
  <figure class="relative size-full bg-gray-100">
    <img
      :src="image?.url"
      :srcset="srcset"
      :alt="image?.altText ?? alt"
      class="absolute size-full inset-0 object-cover"
      loading="eager"
      decoding="async"
      fetchpriority="high"
    >
  </figure>
</template>
