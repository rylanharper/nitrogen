<script setup lang="ts">
// Props
const props = defineProps<{
  sortOptions: {
    label: string
    value: string | null
  }[]
  filterOptions: {
    label: string
    values: {
      label: string
      id: string
      count: number
      swatch?: any
    }[]
  }[]
  activeFilterCount: number
}>()

// Emits
const emit = defineEmits<{
  closeFilter: []
  setSortOption: [sortValue: string | null]
  setFilterOption: [filterId: string]
  clearAllFilters: []
}>()

// Emit events
const closeFilter = () => {
  emit('closeFilter')
}

const setSortOption = (sortValue: string | null) => {
  emit('setSortOption', sortValue)
}

const setFilterOption = (filterId: string) => {
  emit('setFilterOption', filterId)
}

const clearAllFilters = () => {
  emit('clearAllFilters')
}

// Composables
const route = useRoute()
const appStore = useAppStore()
</script>

<template>
  <Transition name="bg-fade">
    <div
      v-if="appStore.filterMenu"
      class="hidden fixed inset-0 z-200 bg-black/50 pointer-events-auto lg:flex"
      @click="closeFilter"
    />
  </Transition>
  <Transition name="slider">
    <aside
      v-if="appStore.filterMenu"
      class="hidden fixed top-0 left-0 z-200 w-full bg-white lg:flex"
    >
      <div class="relative flex flex-col justify-between gap-20 w-full px-6 py-4">
        <div class="absolute top-0 right-0 px-6 py-4">
          <button
            type="button"
            class="flex ring-1 ring-offset-2 ring-transparent rounded-xs focus:ring-black"
            @click="closeFilter"
          >
            <Icon
              name="ph:x"
              class="inline-block shrink-0 size-5!"
            />
          </button>
        </div>
        <div class="grid grid-cols-4 gap-10">
          <div>
            <h3 class="mb-5 uppercase">
              Sort By
            </h3>
            <div class="flex flex-col">
              <button
                v-for="(option, index) in props.sortOptions"
                :key="index"
                :class="{ underline: route.query.sort === option.value || (option.value === null && !route.query.sort) }"
                class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                @click="setSortOption(option.value)"
              >
                <span>{{ option.label }}</span>
              </button>
            </div>
          </div>
          <div
            v-for="group in props.filterOptions"
            :key="group.label"
          >
            <h3 class="mb-5 uppercase">
              {{ group.label }}
            </h3>
            <div class="flex flex-col">
              <button
                v-for="option in group.values"
                :key="option.id"
                :class="{ 'underline border-black': (route.query.filter as string[])?.includes(option.id) }"
                class="flex items-center gap-3 max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px] hover:underline"
                @click="setFilterOption(option.id)"
              >
                <span
                  v-if="option.swatch?.color"
                  :class="{
                    'border-black': (route.query.filter as string[])?.includes(option.id),
                    'border-gray-100': !(route.query.filter as string[])?.includes(option.id),
                  }"
                  :style="{ backgroundColor: option.swatch.color }"
                  class="size-3 border rounded-full"
                />
                <img
                  v-if="option.swatch?.image"
                  :src="option.swatch.image.url"
                  :class="{
                    'border-black': (route.query.filter as string[])?.includes(option.id),
                    'border-gray-100': !(route.query.filter as string[])?.includes(option.id),
                  }"
                  alt="Color Swatch Image"
                  class="size-3 border rounded-full"
                >
                <span>{{ option.label }}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <div class="flex gap-4">
            <button
              type="button"
              class="flex items-center justify-center p-2 px-4 uppercase bg-transparent border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-100"
              @click="clearAllFilters"
            >
              <span>Clear All Filters ({{ props.activeFilterCount }})</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center p-2 px-4 uppercase bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
              @click="closeFilter"
            >
              <span>View Products</span>
            </button>
          </div>
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
  @apply transform -translate-y-full;
}

.slider-enter-to,
.slider-leave-from {
  @apply transform translate-y-0;
}
</style>
