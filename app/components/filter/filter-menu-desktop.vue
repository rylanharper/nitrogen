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
  <Transition name="slider" mode="out-in" appear>
    <aside
      v-if="appStore.filterMenuOpen"
      class="hidden fixed top-0 z-[200] w-full bg-white lg:flex"
    >
      <div class="relative flex flex-col justify-between gap-20 w-full px-6 py-4">
        <div class="absolute top-0 right-0 px-6 py-4">
          <button
            type="button"
            class="flex ring-1 ring-offset-2 ring-transparent rounded-sm focus:ring-black"
            @click="closeFilter"
          >
            <Icon name="ph:x" class="h-5 w-5 shrink-0" />
          </button>
        </div>
        <div class="grid grid-cols-4 gap-10">
          <div>
            <h3 class="mb-5">Sort By</h3>
            <div class="flex flex-col">
              <button
                v-for="(option, index) in props.sortOptions"
                :key="index"
                :class="{ 'underline': route.query.sort === option.value || (option.value === null && !route.query.sort) }"
                class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                @click="setSortOption(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <div>
            <h3 class="mb-5">Color</h3>
            <div class="flex flex-col">
              <button
                v-for="(color, index) in props.colorOptions"
                :key="index"
                :class="{ 'underline': (route.query.color as string)?.split(',').includes(color) }"
                class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                @click="setFilterOption('color', color)"
              >
                {{ color }}
              </button>
            </div>
          </div>
          <div>
            <h3 class="mb-5">Size</h3>
            <div class="flex flex-col">
              <button
                v-for="(size, index) in props.sizeOptions"
                :key="index"
                :class="{ 'underline': (route.query.size as string)?.split(',').includes(size) }"
                class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                @click="setFilterOption('size', size)"
              >
                {{ size }}
              </button>
            </div>
          </div>
          <div>
            <h3 class="mb-5">Style</h3>
            <div class="flex flex-col">
              <button
                v-for="(type, index) in props.productTypeOptions"
                :key="index"
                :class="{ 'underline': (route.query.productType as string)?.split(',').includes(type) }"
                class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                @click="setFilterOption('productType', type)"
              >
                {{ type }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <div class="flex gap-4">
            <button
              type="button"
              class="flex items-center justify-center p-2 px-4 text-normalize bg-transparent border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-100"
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
      </div>
    </aside>
  </Transition>
  <Transition name="fade" mode="out-in" appear>
    <div
      v-if="appStore.filterMenuOpen"
      class="hidden fixed inset-0 z-[150] pointer-events-auto bg-black/50 lg:flex"
      @click="closeFilter"
    />
  </Transition>
</template>

<style lang="css" scoped>
.slider-enter-active,
.slider-leave-active {
  @apply transform translate-y-0;
  @apply transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)];
}

.slider-enter-from,
.slider-leave-to {
  @apply transform translate-x-full lg:translate-x-0 lg:-translate-y-full;
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
