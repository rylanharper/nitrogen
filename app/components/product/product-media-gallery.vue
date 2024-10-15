<script setup lang="ts">
import type {
  ProductFragment,
  VideoFragment,
  MediaImageFragment
} from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
}>();

// Emits
const emit = defineEmits(['openLightbox']);

// Emit events
const handleMediaClick = (index: number) => {
  emit('openLightbox', index);
};

// Computed properties
const mediaItems = computed(() => flattenNodeConnection(props.product?.media));

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
      v-for="(media, index) in mediaItems"
      :key="media.id"
      @click="handleMediaClick(index)"
      class="cursor-zoom-in"
    >
      <shopify-video v-if="isMediaVideo(media)" :video="media" />
      <shopify-image
        v-else-if="isMediaImage(media)"
        :image="media.image"
        :alt="media.image?.altText || `${product.title}`"
      />
    </div>
  </div>
</template>
