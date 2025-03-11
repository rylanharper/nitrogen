<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core';
import { flattenConnection } from '@/utils/graphql';

// Stores
const appStore = useAppStore();
const cartStore = useCartStore();

// Computed
const cartTotalItems = computed(() => cartStore.lineItemsCount);

// Flatten connections
const lineItems = computed(() => flattenConnection(cartStore.lineItems));

// Actions
const closeDrawer = () => {
  appStore.toggle('cartDrawer', false);
};

// Watchers
const route = useRoute();
const { escape } = useMagicKeys();

watch(
  () => route.path,
  () => {
    closeDrawer();
  }
);

if (escape) {
  watch(escape, () => {
    closeDrawer();
  });
}
</script>

<template>
  <Transition name="bg-fade">
    <div
      v-if="appStore.cartDrawer"
      class="fixed inset-0 z-200 bg-black/50 pointer-events-auto"
      @click="closeDrawer"
    />
  </Transition>
  <Transition name="slider">
    <aside
      v-if="appStore.cartDrawer"
      class="fixed top-0 right-0 z-200 size-full bg-white md:max-w-[450px]"
    >
      <div class="flex flex-col size-full px-5">
        <div class="flex justify-between items-center py-3 border-b border-zinc-300 lg:py-4">
          <h2 class="uppercase">Your Cart ({{ cartTotalItems }})</h2>
          <button
            class="flex ring-1 ring-transparent ring-offset-2 rounded-xs focus:ring-black"
            @click="closeDrawer"
          >
            <Icon name="ph:x" class="size-5 shrink-0" />
          </button>
        </div>
        <div v-if="lineItems?.length" class="flex flex-col size-full">
          <div class="flex-1 overflow-y-scroll overflow-x-hidden no-scrollbar">
            <CartLine v-for="line in lineItems" :key="line.id" :line="line" />
          </div>
          <CartSummary />
        </div>
        <div v-else class="flex flex-col justify-center items-center flex-1">
          <p class="mb-3 text-xl tracking-tight leading-none text-center">
            Your cart is empty
          </p>
          <button
            class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
            @click="closeDrawer"
          >
            Back to Store
          </button>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
@reference "tailwindcss";

.bg-fade-enter-active,
.bg-fade-leave-active {
  @apply transition duration-200 ease-out;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  @apply opacity-0;
}

.bg-fade-enter-to,
.bg-fade-leave-from {
  @apply opacity-100;
}

.slider-enter-active,
.slider-leave-active {
  @apply transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)];
}

.slider-enter-from,
.slider-leave-to {
  @apply transform translate-x-full;
}

.slider-enter-to,
.slider-leave-from {
  @apply transform translate-x-0;
}
</style>
