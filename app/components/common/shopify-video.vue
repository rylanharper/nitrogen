<script setup lang="ts">
import type { VideoFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  video: VideoFragment;
}>();
</script>

<template>
  <figure class="relative aspect-square bg-gray-100">
    <video
      :poster="video.previewImage?.url ?? ''"
      class="absolute size-full inset-0 object-cover"
      playsinline
      autoplay
      loop
      muted
    >
      <source
        v-for="source in video.sources"
        :key="source.url"
        :src="source.url"
        :type="source.mimeType"
      />
    </video>
  </figure>
</template>
