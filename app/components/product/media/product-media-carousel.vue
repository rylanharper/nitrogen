<script setup lang="ts">
import type { VideoFragment, MediaImageFragment } from '@@/types/shopify';
import emblaCarouselVue from 'embla-carousel-vue';

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

// Embla carousel setup
const [emblaRef, emblaAPI] = emblaCarouselVue({ loop: true });

// Next/prev
const scrollNext = () => emblaAPI?.value?.scrollNext();
const scrollPrev = () => emblaAPI?.value?.scrollPrev();

// Watchers
const activeSlide = ref(0)

// Watchers
watch(
  () => emblaAPI.value,
  (emblaAPIValue) => {
    if (!emblaAPIValue) return;

    // Set active slide
    activeSlide.value = emblaAPIValue.selectedScrollSnap();

    // Update active slide
    emblaAPIValue.on('select', () => {
      activeSlide.value = emblaAPIValue.selectedScrollSnap();
    });
  }
);
</script>

<template>
  <div ref="emblaRef" class="relative overflow-hidden lg:hidden">
    <div class="flex">
      <div
        v-for="(media, index) in mediaItems"
        :key="media.id"
        class="flex-[0_0_100%] aspect-square"
      >
        <shopify-video v-if="isMediaVideo(media)" :video="media" />
        <shopify-image
          v-else-if="isMediaImage(media)"
          :image="media.image"
          :alt="media.image?.altText || ''"
        />
      </div>
    </div>
    <div class="absolute flex items-center justify-center gap-2 w-full p-2 bottom-0">
      <div v-for="(item, index) in mediaItems" :key="index">
        <button
          @click="emblaAPI?.scrollTo(index)"
          class="h-2 w-2 rounded-full border border-black"
          :class="{ 'bg-black': index === activeSlide }"
        />
      </div>
    </div>
    <button
      @click="scrollPrev"
      class="absolute flex items-center justify-center z-10 p-2 top-0 left-0 h-full"
    >
      <Icon name="ph:caret-left" class="h-5 w-5 shrink-0" />
    </button>
    <button
      @click="scrollNext"
      class="absolute flex items-center justify-center z-10 p-2 top-0 right-0 h-full"
    >
      <Icon name="ph:caret-right" class="h-5 w-5 shrink-0" />
    </button>
  </div>
</template>
