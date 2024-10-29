<script setup lang="ts">
import type { VideoFragment, MediaImageFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  mediaItems: Array<VideoFragment | MediaImageFragment>;
  currentIndex: number;
}>();

// Emits
const emit = defineEmits(['close']);

// Emit events
const closeLightbox = () => {
  emit('close');
};

// Check if media item is a video
const isMediaVideo = (media: any): media is VideoFragment => {
  return media?.mediaContentType === 'VIDEO';
};

// Check if media item is an image
const isMediaImage = (media: any): media is MediaImageFragment => {
  return media?.mediaContentType === 'IMAGE';
};

// Refs
const mediaRefs = ref<(HTMLElement | null)[]>([]);

onMounted(() => {
  nextTick(() => {
    const selectedItem = mediaRefs.value[props.currentIndex];
    selectedItem?.scrollIntoView();
  });
});

// Watchers
const { escape } = useMagicKeys();

if (escape) {
  watch(escape, () => {
    closeLightbox()
  });
}
</script>

<template>
  <section class="hidden fixed items-center justify-center inset-0 z-[200] bg-white lg:flex">
    <button
      @click="closeLightbox"
      class="flex absolute z-10 top-4 right-10 ring-1 ring-transparent ring-offset-2 ring-offset-[#f2f2f2] rounded-sm focus:ring-black"
    >
      <Icon name="ph:x" class="h-6 w-6 shrink-0" />
    </button>
    <div class="flex flex-col overflow-auto size-full">
      <div
        v-for="(media, index) in mediaItems"
        :key="media.id"
        :ref="el => mediaRefs[index] = el"
        @click="closeLightbox"
        class="aspect-square cursor-zoom-out"
      >
        <shopify-video v-if="isMediaVideo(media)" :video="media" />
        <shopify-image
          v-else-if="isMediaImage(media)"
          :image="media.image"
          :alt="media.image?.altText || ''"
        />
      </div>
    </div>
  </section>
</template>
