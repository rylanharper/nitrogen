<script setup lang="ts">
import type { ProductFragment, ProductVariantFragment } from '@@/types/shopify-storefront'

import { getSizeOption, isSizeSoldOut } from '@/helpers/shopify'

// Props
const props = defineProps<{
  product: ProductFragment
  variants: ProductVariantFragment[]
  selectedSize: string
}>()

// Emits
const emits = defineEmits<{
  setSizeOption: [size: string]
}>()

// Computed
const sizeOption = computed(() => getSizeOption(props.product.options))

// Get size options
const productSizes = computed(() => {
  const sizeOption = getSizeOption(props.product.options)
  const sizeOptions = sizeOption?.optionValues || []

  return sizeOptions.map((option) => ({
    id: option.id,
    name: option.name,
    isSoldOut: isSizeSoldOut(props.variants, option.name),
  }))
})

// Emit events
const setSizeOption = (size: string) => {
  emits('setSizeOption', size)
}
</script>

<template>
  <div
    v-if="sizeOption"
    class="flex flex-col gap-2"
  >
    <div class="flex items-center justify-between">
      <span class="uppercase">Size</span>
      <button class="flex items-center justify-center gap-1.5 hover:text-gray-500">
        <Icon
          name="ph:ruler"
          class="inline-block shrink-0 !size-5"
        />
        Size Guide
      </button>
    </div>
    <div class="grid grid-cols-4 gap-2.5">
      <button
        v-for="size in productSizes"
        :key="size.id"
        class="relative flex items-center justify-center p-2 px-4 text-normalize bg-white border rounded-md overflow-hidden transition duration-200 ease-in-out"
        :class="[
          props.selectedSize === size.name
            ? 'border-black bg-gray-100'
            : 'border-zinc-300 hover:bg-zinc-200',
          size.isSoldOut
            ? 'text-zinc-400 after:h-px after:w-[150%] after:-rotate-[18deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-zinc-300'
            : 'text-black',
        ]"
        :aria-label="`Size Option ${size.name}`"
        @click="setSizeOption(size.name)"
      >
        {{ size.name }}
      </button>
    </div>
  </div>
</template>
