<script setup lang="ts">
// Props
const props = defineProps<{
  colorOptions: {
    name: string;
    hex: string;
    image: string | null
  }[];
  sizeOptions: string[];
  productTypeOptions: string[];
  sortOptions: {
    label: string;
    value: string | null
  }[];
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
const closeFilter = () => {
  emit('closeFilter');
};

const setSortOption = (sortValue: string | null) => {
  emit('setSortOption', sortValue);
};

const setFilterOption = (filterName: string, filterValue: string) => {
  emit('setFilterOption', filterName, filterValue);
};

const clearAllFilters = () => {
  emit('clearAllFilters');
};
</script>

<template>
  <Transition name="bg-fade" appear>
    <div
      v-if="appStore.filterMenu"
      class="fixed inset-0 z-[200] bg-black/50 lg:hidden"
      @click="closeFilter"
    />
  </Transition>
  <Transition name="slider" appear>
    <aside
      v-if="appStore.filterMenu"
      class="fixed top-0 right-0 z-[200] size-full bg-white md:max-w-[450px] lg:hidden"
    >
      <div class="flex flex-col size-full px-5">
        <div class="flex justify-between items-center py-3 border-b border-zinc-300">
          <h2>Filters</h2>
          <button
            type="button"
            class="flex ring-1 ring-offset-2 ring-transparent rounded-sm focus:ring-black"
            @click="closeFilter"
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
                    v-for="(option, index) in props.sortOptions"
                    :key="index"
                    :class="{ 'underline': route.query.sort === option.value || (option.value === null && !route.query.sort) }"
                    class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px]"
                    @click="setSortOption(option.value)"
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
                    v-for="(color, index) in props.colorOptions"
                    :key="index"
                    :class="{ 'underline border-black': (route.query.color as string)?.split(',').includes(color.name) }"
                    class="flex items-center gap-3 max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                    @click="setFilterOption('color', color.name)"
                  >
                    <span
                      v-if="color.hex"
                      :class="{
                        'border-black': (route.query.color as string)?.split(',').includes(color.name),
                        'border-gray-100': !(route.query.color as string)?.split(',').includes(color.name)
                      }"
                      :style="{ backgroundColor: color.hex }"
                      class="size-3 border rounded-full"
                    />
                    <img
                      v-if="color.image"
                      :src="color.image"
                      :class="{
                        'border-black': (route.query.color as string)?.split(',').includes(color.name),
                        'border-gray-100': !(route.query.color as string)?.split(',').includes(color.name)
                      }"
                      alt="Color Swatch Image"
                      class="size-3 border rounded-full"
                    >
                    {{ color.name }}
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
                    v-for="(size, index) in props.sizeOptions"
                    :key="index"
                    :class="{ 'underline': (route.query.size as string)?.split(',').includes(size) }"
                    class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px]"
                    @click="setFilterOption('size', size)"
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
                    v-for="(type, index) in props.productTypeOptions"
                    :key="index"
                    :class="{ 'underline': (route.query.productType as string)?.split(',').includes(type) }"
                    class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px]"
                    @click="setFilterOption('productType', type)"
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
            class="flex items-center justify-center text-normalize"
            @click="clearAllFilters"
          >
            Clear All Filters ({{ props.activeFilterCount }})
          </button>
          <button
            type="button"
            class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
            @click="closeFilter"
          >
            View Products
          </button>
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
