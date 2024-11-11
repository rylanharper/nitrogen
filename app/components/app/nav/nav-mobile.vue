<script setup lang="ts">
import { useCartStore } from '@/stores/cart';

// Stores
const cartStore = useCartStore();

// Computed
const cartTotalItems = computed(() => cartStore.lineItemsCount);

// Emits
const emit = defineEmits([
  'toggleShopMenu',
  'toggleSearchMenu',
  'toggleCartDrawer'
]);
</script>

<template>
  <nav class="grid grid-cols-[1fr_max-content_1fr] gap-4 min-h-[--header-height] px-4 lg:hidden">
    <div class="grid grid-flow-col justify-start items-center">
      <button
        class="flex p-2 text-normalize bg-transparent rounded-full"
        @click="emit('toggleShopMenu')"
      >
        Menu
      </button>
    </div>
    <div class="flex items-center">
      <NuxtLink id="logo" to="/" class="p-2 bg-transparent rounded-full">
        Nitrogen
      </NuxtLink>
    </div>
    <div class="grid grid-flow-col justify-end items-center">
      <button
        class="flex p-2 text-normalize bg-transparent rounded-full"
        @click="emit('toggleSearchMenu')"
      >
        <Icon name="ph:magnifying-glass" class="h-5 w-5 shrink-0" />
      </button>
      <button
        class="flex p-2 text-normalize bg-transparent rounded-full"
        @click="emit('toggleCartDrawer')"
      >
        Cart ({{ cartTotalItems }})
      </button>
    </div>
  </nav>
</template>
