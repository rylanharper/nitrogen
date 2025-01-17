<script setup lang="ts">
import type { VideoFragment, MediaImageFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  productMedia: Array<VideoFragment | MediaImageFragment>;
}>();

// Check if media item is a video
const isMediaVideo = (media: any): media is VideoFragment => {
  return media?.mediaContentType === 'VIDEO';
};

// Check if media item is an image
const isMediaImage = (media: any): media is MediaImageFragment => {
  return media?.mediaContentType === 'IMAGE';
};

// Stores
const appStore = useAppStore();

// State
const mediaIndex = ref<number>(0);

// Actions
const toggleLightbox = (index: number) => {
  mediaIndex.value = index;
  appStore.toggleMediaLightbox();
};

// Watchers
const isScrollLocked = useScrollLock(document);

watch(
  () => appStore.mediaLightboxOpen,
  (isOpen) => {
    isScrollLocked.value = isOpen;
  }
);
</script>

<template>
  <div class="hidden gap-4 lg:grid">
    <div
      v-for="(media, index) in props.productMedia"
      :key="media.id"
      class="aspect-square cursor-zoom-in"
      @click="toggleLightbox(index)"
    >
      <ShopifyVideo
        v-if="isMediaVideo(media)"
        :video="media"
      />
      <ShopifyImage
        v-else-if="isMediaImage(media)"
        :image="media.image"
        :alt="media.image?.altText || ''"
      />
    </div>
  </div>
  <ProductMediaLightbox
    :media-index="mediaIndex"
    :product-media="productMedia"
  />
</template>
