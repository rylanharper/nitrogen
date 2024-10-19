<script setup lang="ts">
// Props
const props = defineProps<{
  colorOptions: string[];
  sizeOptions: string[];
  productTypeOptions: string[];
  sortOptions: { label: string; value: string | null }[];
  activeFilterCount: number;
}>();

// Route
const route = useRoute();

// Stores
const appStore = useAppStore();

// Emits
const emit = defineEmits([
  'closeFilter',
  'setSortOption',
  'setFilterOption',
  'clearAllFilters'
]);

// Emit events
function closeFilter() {
  emit('closeFilter');
}

function setSortOption(sortValue: string | null) {
  emit('setSortOption', sortValue);
}

function setFilterOption(filterName: string, filterValue: string) {
  emit('setFilterOption', filterName, filterValue);
}

function clearAllFilters() {
  emit('clearAllFilters');
}
</script>

<template>
  <transition name="slider" mode="out-in" appear>
    <aside
      v-if="appStore.filterMenuOpen"
      class="fixed top-0 right-0 z-[200] size-full bg-white md:max-w-[450px] lg:hidden"
    >
      <div class="flex flex-col size-full px-5">
        <div class="flex justify-between items-center py-3 border-b border-zinc-300">
          <h2>Filters</h2>
          <button
            type="button"
            @click="closeFilter"
            class="flex ring-1 ring-offset-2 ring-transparent rounded-sm focus:ring-black"
          >
            <Icon name="ph:x" class="h-5 w-5 shrink-0" />
          </button>
        </div>
        <div class="flex-1 overflow-y-scroll overflow-x-hidden no-scrollbar">
          <div class="flex flex-col divide-y divide-zinc-300">
            <details class="group">
              <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span class="truncate">Sort By</span>
                <Icon
                  name="ph:caret-down"
                  class="h-5 w-5 shrink-0 transition group-open:rotate-180"
                />
              </summary>
              <div class="h-0 overflow-hidden group-open:h-auto">
                <div class="flex flex-col pb-4">
                  <button
                    v-for="(option, index) in sortOptions"
                    :key="index"
                    @click="setSortOption(option.value)"
                    :class="{ 'underline': route.query.sort === option.value || (option.value === null && !route.query.sort) }"
                    class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </details>
            <details class="group">
              <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span class="truncate">Color</span>
                <Icon
                  name="ph:caret-down"
                  class="h-5 w-5 shrink-0 transition group-open:rotate-180"
                />
              </summary>
              <div class="h-0 overflow-hidden group-open:h-auto">
                <div class="flex flex-col pb-4">
                  <button
                    v-for="(color, index) in colorOptions"
                    :key="index"
                    @click="setFilterOption('color', color)"
                    :class="{ 'underline': (route.query.color as string)?.split(',').includes(color) }"
                    class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                  >
                    {{ color }}
                  </button>
                </div>
              </div>
            </details>
            <details class="group">
              <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span class="truncate">Size</span>
                <Icon
                  name="ph:caret-down"
                  class="h-5 w-5 shrink-0 transition group-open:rotate-180"
                />
              </summary>
              <div class="h-0 overflow-hidden group-open:h-auto">
                <div class="flex flex-col pb-4">
                  <button
                    v-for="(size, index) in sizeOptions"
                    :key="index"
                    @click="setFilterOption('size', size)"
                    :class="{ 'underline': (route.query.size as string)?.split(',').includes(size) }"
                    class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>
            </details>
            <details class="group">
              <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span class="truncate">Style</span>
                <Icon
                  name="ph:caret-down"
                  class="h-5 w-5 shrink-0 transition group-open:rotate-180"
                />
              </summary>
              <div class="h-0 overflow-hidden group-open:h-auto">
                <div class="flex flex-col pb-4">
                  <button
                    v-for="(type, index) in productTypeOptions"
                    :key="index"
                    @click="setFilterOption('productType', type)"
                    :class="{ 'underline': (route.query.productType as string)?.split(',').includes(type) }"
                    class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                  >
                    {{ type }}
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>
        <div class="flex flex-col gap-3 py-4 bg-white border-t border-zinc-300">
          <button
            type="button"
            @click="clearAllFilters"
            class="flex items-center justify-center text-normalize"
          >
            Clear All Filters ({{ activeFilterCount }})
          </button>
          <button
            type="button"
            @click="closeFilter"
            class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
          >
            View Products
          </button>
        </div>
      </div>
    </aside>
  </transition>
  <transition name="fade" mode="out-in" appear>
    <div
      v-if="appStore.filterMenuOpen"
      @click="closeFilter"
      class="fixed inset-0 z-[150] pointer-events-auto bg-black/50 lg:hidden"
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
