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
      v-if="appStore.filterMenuOpen"
      class="hidden fixed inset-0 z-[200] bg-black/50 lg:flex"
      @click="closeFilter"
    />
  </Transition>
  <Transition name="slider" appear>
    <aside
      v-if="appStore.filterMenuOpen"
      class="hidden fixed top-0 left-0 z-[200] w-full bg-white lg:flex"
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
  @apply transform -translate-y-full;
}

.slider-enter-to,
.slider-leave-from {
  @apply transform translate-y-0;
}
</style>
