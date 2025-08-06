<script setup lang="ts">
import type { MediaFragment } from '@@/types/shopify-storefront'

import { isMediaVideo, isMediaImage } from '@/helpers/shopify'

// Props
const props = defineProps<{
  productMedia: MediaFragment[]
  mediaIndex: number
}>()

// Stores
const appStore = useAppStore()

// Actions
const closeLightbox = () => {
  appStore.toggle('mediaLightbox', false)
}

// Refs
const mediaRefs = useTemplateRef('mediaRefs')

// Watchers
const { escape } = useMagicKeys()

watch(
  () => props.mediaIndex,
  async (index) => {
    await nextTick()
    const el = mediaRefs.value?.[index]
    el?.scrollIntoView()
  },
)

if (escape) {
  watch(escape, closeLightbox)
}
</script>

<template>
  <section
    v-if="appStore.mediaLightbox"
    class="hidden fixed items-center justify-center inset-0 z-200 bg-white lg:flex"
  >
    <button
      class="flex absolute z-10 top-4 right-10 ring-1 ring-transparent ring-offset-2 ring-offset-[#f2f2f2] rounded-xs focus:ring-black"
      @click="closeLightbox"
    >
      <Icon
        name="ph:x"
        class="inline-block shrink-0 !size-6"
      />
    </button>
    <div class="flex flex-col overflow-auto size-full">
      <div
        v-for="(media, index) in productMedia"
        :key="media.id"
        ref="mediaRefs"
        class="aspect-square cursor-zoom-out"
        @click="closeLightbox"
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
  </section>
</template>
