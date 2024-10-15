<script setup lang="ts">
import type {
  ProductFragment,
  VideoFragment,
  MediaImageFragment
} from '@@/types/shopify';
import emblaCarouselVue from 'embla-carousel-vue';

// Props
const props = defineProps<{
  product: ProductFragment;
}>();

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

    // Set initial active slide
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
        class="flex-[0_0_100%] min-w-0"
      >
        <shopify-video v-if="isMediaVideo(media)" :video="media" />
        <shopify-image
          v-else-if="isMediaImage(media)"
          :image="media.image"
          :alt="media.image?.altText || `${props.product.title}`"
        />
      </div>
    </div>
    <div class="absolute flex items-center justify-center gap-1.5 w-full p-2 bottom-0">
      <div v-for="(item, index) in mediaItems" :key="index">
        <button
          @click="emblaAPI?.scrollTo(index)"
          :class="{ 'bg-black': index === activeSlide }"
          class="h-1.5 w-1.5 rounded-full border border-black"
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
