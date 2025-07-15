<script setup lang="ts">
import { useCartStore } from '@/stores/cart';

// Stores
const cartStore = useCartStore();

// Computed
const cartTotalItems = computed(() => cartStore.lineItemCount);

// Emits
const emit = defineEmits<{
  toggleMobileMenu: []
  toggleSearchMenu: []
  toggleCartDrawer: []
}>()

// Emit events
const toggleMobileMenu = () => {
  emit('toggleMobileMenu')
}

const toggleSearchMenu = () => {
  emit('toggleSearchMenu')
}

const toggleCartDrawer = () => {
  emit('toggleCartDrawer')
}
</script>

<template>
  <nav class="grid grid-cols-[1fr_max-content_1fr] gap-4 min-h-(--header-height) px-4 lg:hidden">
    <div class="grid grid-flow-col justify-start items-center">
      <button
        class="flex p-2 text-normalize bg-transparent rounded-full"
        @click="toggleMobileMenu"
      >
        <span>Menu</span>
      </button>
    </div>
    <div class="flex items-center">
      <NuxtLink
        id="logo"
        to="/"
        class="p-2 text-normalize bg-transparent rounded-full"
      >
        <span>Nitrogen</span>
      </NuxtLink>
    </div>
    <div class="grid grid-flow-col justify-end items-center">
      <button
        class="flex p-2 text-normalize bg-transparent rounded-full"
        @click="toggleSearchMenu"
      >
        <Icon
          name="ph:magnifying-glass"
          class="inline-block shrink-0 !size-5"
        />
      </button>
      <button
        class="flex p-2 text-normalize bg-transparent rounded-full"
        @click="toggleCartDrawer"
      >
        <span>Cart ({{ cartTotalItems }})</span>
      </button>
    </div>
  </nav>
</template>
