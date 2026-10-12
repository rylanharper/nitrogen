<script setup lang="ts">
import type { ProductVariantFragment } from '#shopify/storefront'

// Props
const props = defineProps<{
  currentVariant?: ProductVariantFragment
  variants: ProductVariantFragment[]
}>()

// Composables
const appStore = useAppStore()
const cartStore = useCartStore()

// State
const isLoading = ref(false)

// Actions
const openDrawer = () => {
  appStore.toggle('cartDrawer', true)
}

const addToCart = async () => {
  if (!props.currentVariant) return
  isLoading.value = true

  try {
    await cartStore.addToCart([{ merchandiseId: props.currentVariant.id, quantity: 1 }])
    openDrawer()
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col">
    <button
      v-if="props.currentVariant?.availableForSale"
      :disabled="isLoading"
      class="flex items-center justify-center p-2 px-4 uppercase bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200 disabled:opacity-60"
      @click="addToCart"
    >
      {{ isLoading ? 'Adding...' : 'Add to Cart' }}
    </button>
    <button
      v-else-if="!props.currentVariant && props.variants.length > 1"
      class="flex items-center justify-center p-2 px-4 uppercase bg-line-pattern border border-zinc-300 rounded-md cursor-default"
    >
      Select Size
    </button>
    <button
      v-else
      disabled
      class="flex items-center justify-center p-2 px-4 uppercase bg-line-pattern border border-zinc-300 rounded-md cursor-default"
    >
      Sold Out
    </button>
  </div>
</template>
