<script setup lang="ts">
import type { VideoFragment } from '@@/types/shopify-storefront'

// Props
const props = defineProps<{
  video: VideoFragment
  height?: number
  width?: number
}>()
</script>

<template>
  <figure class="relative w-full bg-gray-100">
    <video
      :poster="video?.previewImage?.url ?? ''"
      :height="props.height ?? 100"
      :width="props.width ?? 100"
      class="aspect-square size-full object-cover"
      playsinline
      autoplay
      loop
      muted
    >
      <source
        v-for="source in props.video?.sources"
        :key="source.url"
        :src="source.url"
        :type="source.mimeType"
      />
    </video>
  </figure>
</template>
