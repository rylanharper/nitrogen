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
      v-for="(media, index) in mediaItems.slice(0, 2)"
      :key="media.id"
      class="absolute size-full transition-opacity ease-in-out"
      :class="{ 'opacity-0 hover:opacity-100': index === 1 }"
    >
      <shopify-video v-if="isMediaVideo(media)" :video="media" />
      <shopify-image
        v-else-if="isMediaImage(media)"
        :image="media.image"
        :alt="media.image?.altText || ''"
      />
    </div>
  </div>
</template>
