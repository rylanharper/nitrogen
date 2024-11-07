<script setup lang="ts">
import type { VideoFragment, MediaImageFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  productMedia: Array<VideoFragment | MediaImageFragment>;
}>();

// Emits
const emit = defineEmits(['openLightbox']);

// Emit events
function openLightbox(index: number) {
  emit('openLightbox', index);
};

// Check if media item is a video
const isMediaVideo = (media: any): media is VideoFragment => {
  return media?.mediaContentType === 'VIDEO';
};

// Check if media item is an image
const isMediaImage = (media: any): media is MediaImageFragment => {
  return media?.mediaContentType === 'IMAGE';
};
</script>

<template>
  <div class="hidden gap-4 lg:grid">
    <div
      v-for="(media, index) in productMedia"
      :key="media.id"
      @click="openLightbox(index)"
      class="aspect-square cursor-zoom-in"
    >
      <ShopifyVideo v-if="isMediaVideo(media)" :video="media" />
      <ShopifyImage
        v-else-if="isMediaImage(media)"
        :image="media.image"
        :alt="media.image?.altText || ''"
      />
    </div>
  </div>
</template>
