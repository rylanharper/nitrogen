<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Model bindings
const searchQuery = defineModel<string>();

// Props
const props = defineProps<{
  products: ProductFragment[];
}>();

// Stores
const appStore = useAppStore();

// State
const input = ref<HTMLInputElement | null>(null);

// Emits
const emit = defineEmits([
  'submitQuery',
  'closeSearch'
]);

// Emit events
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('submitQuery');
  }
};

const closeSearch = () => {
  emit('closeSearch');
};

// Watchers
watch(
  () => appStore.searchMenu,
  (isOpen) => {
    if (!isOpen) {
      searchQuery.value = '';
    }
  }
);

watch(
  () => appStore.searchMenu,
  () => {
    nextTick(() => {
      input.value?.focus();
    });
  }
);
</script>

<template>
  <Transition name="bg-fade" appear>
    <div
      v-if="appStore.searchMenu"
      class="fixed inset-0 z-[200] bg-black/50 lg:hidden"
    />
  </Transition>
  <Transition name="slider" appear>
    <aside
      v-if="appStore.searchMenu"
      class="fixed inset-0 z-[200] size-full bg-white lg:hidden"
    >
      <div class="flex flex-col gap-10 size-full px-5">
        <div class="relative flex">
          <input
            ref="input"
            v-model="searchQuery"
            type="text"
            name="searchInput"
            placeholder="Search products"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            class="peer flex w-full py-3 pl-8 normal-case bg-white border-b border-zinc-300 appearance-none rounded-none placeholder:text-zinc-400 focus:border-black focus:outline-none"
            @keydown="onKeyDown"
          >
          <div class="absolute flex inset-y-0 start-0 items-center text-zinc-400 peer-focus:text-black select-none">
            <Icon name="ph:magnifying-glass" class="h-5 w-5 shrink-0" />
          </div>
          <button
            class="absolute flex inset-y-0 end-0 items-center text-zinc-400 peer-focus:text-black active:text-black"
            @click="closeSearch"
          >
            <Icon name="ph:x" class="h-5 w-5 shrink-0" />
          </button>
        </div>
        <div class="flex flex-col flex-1 overflow-y-scroll overflow-x-hidden no-scrollbar">
          <div v-if="props.products?.length" class="grid grid-cols-2 gap-x-4 gap-y-8 w-full">
            <SuggestedProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style lang="css" scoped>
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
