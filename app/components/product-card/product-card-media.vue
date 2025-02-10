<script setup lang="ts">
import type { VideoFragment, MediaImageFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  mediaItems: Array<VideoFragment | MediaImageFragment>;
}>();

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
  <div class="relative overflow-hidden aspect-square">
    <div
      v-for="(media, index) in props.mediaItems.slice(0, 2)"
      :key="media.id"
      class="absolute transition-opacity duration-150"
      :class="{ 'opacity-0 lg:hover:opacity-100': index === 1 }"
    >
      <ShopifyVideo
        v-if="isMediaVideo(media)"
        :video="media"
      />
      <ShopifyImage
        v-else-if="isMediaImage(media)"
        :image="media.image"
        :alt="media.image?.altText || ''"
        :index="index"
      />
    </div>
  </div>
</template>
