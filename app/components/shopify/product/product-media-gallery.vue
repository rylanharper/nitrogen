<script setup lang="ts">
import type { MediaFragment } from '@@/types/shopify-storefront'

import { isMediaVideo, isMediaImage } from '@/helpers/shopify'

// Props
const props = defineProps<{
  productMedia: MediaFragment[]
}>()

// Stores
const appStore = useAppStore()

// State
const mediaIndex = ref<number>(0)

// Actions
const toggleLightbox = (index: number) => {
  mediaIndex.value = index
  appStore.toggle('mediaLightbox')
}

// Watchers
const isScrollLocked = useScrollLock(document)

watch(
  () => appStore.mediaLightbox,
  (isOpen) => {
    isScrollLocked.value = isOpen
  },
)
</script>

<template>
  <div class="hidden gap-4 lg:grid">
    <div
      v-for="(media, index) in props.productMedia"
      :key="media.id"
      class="aspect-square overflow-hidden cursor-zoom-in"
      @click="toggleLightbox(index)"
    >
      <ShopifyVideo
        v-if="isMediaVideo(media)"
        :video="media"
      />
      <ShopifyImage
        v-else-if="isMediaImage(media)"
        :image="media.image!"
        :alt="media.image?.altText || ''"
        :index="index"
      />
    </div>
  </div>
  <ProductMediaLightbox
    :media-index="mediaIndex"
    :product-media="props.productMedia"
  />
</template>
