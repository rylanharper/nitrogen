<script setup lang="ts">
import type { ImageFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  image: ImageFragment;
  alt: string;
}>();

// Computed
// eslint-disable-next-line vue/return-in-computed-property
const srcset = computed(() => {
  if (props.image.url.includes('cdn.shopify.com')) {
    const sizes = [640, 768, 1280, 1536, 1920, 2240];

    return sizes
      .map((width) => `${formatSizeUrl(props.image.url, width)} ${width}w`)
      .join(', ');
  }
});
</script>

<template>
  <figure class="relative size-full bg-gray-100">
    <img
      :src="image.url"
      :srcset="srcset"
      :alt="image.altText ?? alt"
      class="absolute size-full inset-0 object-cover"
      loading="lazy"
      decoding="async"
    >
  </figure>
</template>
