<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { useCartStore } from '@/stores/cart';
import { flattenNodeItem } from '@/utils/flatten-nodes';
import { useMagicKeys } from '@vueuse/core';

// Stores
const appStore = useAppStore();
const cartStore = useCartStore();

// Computed
const cartTotalItems = computed(() => cartStore.lineItemsCount);
const lineItems = computed(() => flattenNodeItem(cartStore.lineItems));

// Close drawer
function closeDrawer() {
  appStore.cartDrawerOpen = false;
}

// Watchers
const route = useRoute();
const { escape } = useMagicKeys();

watch(
  () => route.fullPath,
  () => {
    if (appStore.cartDrawerOpen) {
      closeDrawer();
    }
  }
);

watch(escape, () => {
  if (appStore.cartDrawerOpen) {
    closeDrawer();
  }
});
</script>

<template>
  <transition name="slider" mode="out-in" appear>
    <aside
      v-if="appStore.cartDrawerOpen"
      class="fixed top-0 right-0 z-[200] size-full bg-white md:max-w-[450px]"
    >
      <div class="flex flex-col size-full px-5">
        <div class="flex justify-between items-center py-3 border-b border-zinc-300 lg:py-4">
          <h2>Your Cart ({{ cartTotalItems }})</h2>
          <button
            type="button"
            @click="closeDrawer"
            class="flex ring-1 ring-offset-2 ring-transparent rounded-sm focus:ring-black"
          >
            <Icon name="ph:x" class="h-5 w-5 shrink-0" />
          </button>
        </div>
        <div v-if="lineItems?.length" class="flex flex-col size-full">
          <div class="flex-1 overflow-y-scroll overflow-x-hidden no-scrollbar">
            <cart-line v-for="line in lineItems" :key="line.id" :line="line" />
          </div>
          <cart-summary />
        </div>
        <div v-else class="flex flex-col justify-center items-center flex-1">
          <p class="mb-3 normal-case text-xl tracking-tight leading-none text-center">
            Your cart is empty
          </p>
          <button
            @click="closeDrawer"
            class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
          >
            Back to Store
          </button>
        </div>
      </div>
    </aside>
  </transition>
  <transition name="fade" mode="out-in" appear>
    <div
      v-if="appStore.cartDrawerOpen"
      @click="closeDrawer"
      class="fixed inset-0 z-[150] pointer-events-auto bg-black/50"
    />
  </transition>
</template>

<style lang="css" scoped>
.slider-enter-active,
.slider-leave-active {
  @apply transform translate-x-0;
  @apply transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)];
}

.slider-enter-from,
.slider-leave-to {
  @apply transform translate-x-full;
  @apply transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)];
}

.fade-enter-active,
.fade-leave-active {
  @apply opacity-100;
  @apply transition duration-300 ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
  @apply transition duration-300 ease-in-out;
}
</style>
