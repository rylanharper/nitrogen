<script setup lang="ts">
import type { MediaFragment } from '@@/types/shopify-storefront'

import { isMediaVideo, isMediaImage } from '@/helpers/shopify';

// Props
const props = defineProps<{
  mediaItems: MediaFragment[]
}>();
</script>

<template>
  <div class="relative aspect-square overflow-hidden">
    <div
      v-for="(media, index) in props.mediaItems.slice(0, 2)"
      :key="media.id"
      class="absolute inset-0 transition-opacity duration-150"
      :class="{ 'opacity-0 lg:hover:opacity-100': index === 1 }"
    >
      <ShopifyVideo
        v-if="isMediaVideo(media)"
        :video="media"
      />
      <ShopifyImage
        v-else-if="isMediaImage(media)"
        :image="media.image!"
        :alt="media.image?.altText || ''"
        :index="index"
      />
    </div>
  </div>
</template>
