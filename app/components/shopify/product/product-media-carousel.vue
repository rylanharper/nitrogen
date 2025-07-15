<script setup lang="ts">
import type { MediaFragment } from '@@/types/shopify-storefront'
import type { EmblaCarouselType } from 'embla-carousel'

import emblaCarouselVue from 'embla-carousel-vue'

import { isMediaVideo, isMediaImage } from '@/helpers/shopify'

// Props
const props = defineProps<{
  productMedia: MediaFragment[]
}>()

// Embla setup
const [emblaRef, emblaApiMain] = emblaCarouselVue({
  loop: true,
})

// State
const canScrollNext = ref(false)
const canScrollPrev = ref(false)
const selectedIndex = ref<number>(0)
const scrollSnaps = ref<number[]>([])

// Next/prev actions
const scrollPrev = () => {
  emblaApiMain.value?.scrollPrev()
}

const scrollNext = () => {
  emblaApiMain.value?.scrollNext()
}

// ScrollTo method
const scrollTo = (index: number) => {
  emblaApiMain.value?.scrollTo(index)
}

// Embla event handlers
const onInit = (api: EmblaCarouselType) => {
  scrollSnaps.value = api?.scrollSnapList() || []
}

const onSelect = (api: EmblaCarouselType) => {
  canScrollNext.value = api?.canScrollNext() || false
  canScrollPrev.value = api?.canScrollPrev() || false
  selectedIndex.value = api?.selectedScrollSnap() || 0
}

onMounted(() => {
  if (!emblaApiMain.value) return

  emblaApiMain.value?.on('init', onInit)
  emblaApiMain.value?.on('select', onSelect)
  emblaApiMain.value?.on('reInit', onSelect)
})

// Cleanup
onUnmounted(() => {
  if (emblaApiMain.value) emblaApiMain.value.destroy()
})
</script>
<template>
  <div ref="emblaRef" class="relative overflow-hidden lg:hidden">
    <div class="flex">
      <div
        v-for="(media, index) in props.productMedia"
        :key="media.id"
        class="flex-[0_0_100%] aspect-square"
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
    <div
      v-if="productMedia.length > 1"
      class="absolute flex items-center justify-center gap-2 w-full p-2 bottom-0 lg:hidden"
    >
      <div
        v-for="(_, index) in scrollSnaps"
        :key="index"
      >
        <button
          class="size-[6px] border border-black rounded-full"
          :class="index === selectedIndex ? 'bg-black' : 'bg-transparent'"
          @click="scrollTo(index)"
        />
      </div>
    </div>
    <div v-if="productMedia.length > 1">
      <button
        class="absolute flex items-center justify-center z-10 p-2 top-0 left-0 h-full"
        @click="scrollPrev"
      >
        <Icon
          name="ph:caret-left"
          class="inline-block shrink-0 !size-5"
        />
      </button>
      <button
        class="absolute flex items-center justify-center z-10 p-2 top-0 right-0 h-full"
        @click="scrollNext"
      >
        <Icon
          name="ph:caret-right"
          class="inline-block shrink-0 !size-5"
        />
      </button>
    </div>
  </div>
</template>
