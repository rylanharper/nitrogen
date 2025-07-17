<script setup lang="ts">
import type { ImageFragment } from '@@/types/shopify-storefront'

import { formatImageUrl } from '@/utils/formatters'

// Props
const props = defineProps<{
  image: ImageFragment
  alt?: string
  index?: number
}>()

// Computed
const srcset = computed(() => {
  const url = props.image?.url
  const sizes = [400, 800, 1200, 1600, 2000, 2400, 2800, 3200]
  return sizes.map((size) => `${formatImageUrl(url, size)} ${size}w`).join(', ')
})

// Define image sizes
const sizes = `(min-width: 1000px) 33vw, 100vw`
</script>

<template>
  <figure class="relative size-full bg-gray-100">
    <img
      :src="props.image?.url"
      :srcset="srcset"
      :sizes="sizes"
      :width="props.image?.width ?? undefined"
      :height="props.image?.height ?? undefined"
      :alt="props.image?.altText ? props.alt : 'Product image'"
      :loading="index === 0 ? 'eager' : 'lazy'"
      :fetch-priority="index === 0 ? 'high' : 'low'"
      class="absolute size-full object-cover object-center"
    />
  </figure>
</template>
