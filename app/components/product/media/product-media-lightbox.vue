<script setup lang="ts">
import type { VideoFragment, MediaImageFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  productMedia: Array<VideoFragment | MediaImageFragment>;
  mediaIndex: number;
}>();

// Emits
const emit = defineEmits(['closeLightbox']);

// Emit events
const closeLightbox = () => {
  emit('closeLightbox');
};;

// Check if media item is a video
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isMediaVideo = (media: any): media is VideoFragment => {
  return media?.mediaContentType === 'VIDEO';
};

// Check if media item is an image
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isMediaImage = (media: any): media is MediaImageFragment => {
  return media?.mediaContentType === 'IMAGE';
};

// State
const mediaRefs = ref<(HTMLElement | null)[]>([]);

onMounted(() => {
  const selectedItem = mediaRefs.value[props.mediaIndex];
  selectedItem?.scrollIntoView();
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
      class="flex absolute z-10 top-4 right-10 ring-1 ring-transparent ring-offset-2 ring-offset-[#f2f2f2] rounded-sm focus:ring-black"
      @click="closeLightbox"
    >
      <Icon name="ph:x" class="h-6 w-6 shrink-0" />
    </button>
    <div class="flex flex-col overflow-auto size-full">
      <div
        v-for="media in productMedia"
        ref="mediaRefs"
        :key="media.id"
        class="aspect-square cursor-zoom-out"
        @click="closeLightbox"
      >
        <ShopifyVideo v-if="isMediaVideo(media)" :video="media" />
        <ShopifyImage
          v-else-if="isMediaImage(media)"
          :image="media.image"
          :alt="media.image?.altText || ''"
        />
      </div>
    </div>
  </section>
</template>
