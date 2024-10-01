<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

// Stores
const cartStore = useCartStore()

// Computed
const cartTotalItems = computed(() => cartStore.lineItemsCount)

// Emits
const emit = defineEmits(['toggleShopMenu', 'toggleCartDrawer'])
</script>

<template>
  <nav class="grid grid-cols-[1fr_max-content_1fr] gap-4 my-1 px-4 lg:hidden">
    <div class="grid grid-flow-col justify-start items-center">
      <button
        @click="$emit('toggleShopMenu')"
        class="p-2 text-normalize bg-transparent rounded-full"
      >
        Menu
      </button>
    </div>
    <div class="flex items-center">
      <nuxt-link to="/" id="logo" class="p-2 text-normalize bg-transparent rounded-full">
        Nitrogen
      </nuxt-link>
    </div>
    <div class="grid grid-flow-col justify-end items-center">
      <button
        @click="$emit('toggleCartDrawer')"
        class="p-2 text-normalize bg-transparent rounded-full"
      >
        Cart ({{ cartTotalItems }})
      </button>
    </div>
  </nav>
</template>
