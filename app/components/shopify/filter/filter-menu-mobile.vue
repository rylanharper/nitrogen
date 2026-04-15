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
  <Transition
    name="bg-fade"
    appear
  >
    <div
      v-if="appStore.filterMenu"
      class="fixed inset-0 z-200 bg-black/50 pointer-events-auto lg:hidden"
      @click="closeFilter"
    />
  </Transition>
  <Transition
    name="slider"
    appear
  >
    <aside
      v-if="appStore.filterMenu"
      class="fixed top-0 right-0 z-200 size-full bg-white md:max-w-[450px] lg:hidden"
    >
      <div class="flex flex-col size-full px-5">
        <div class="flex justify-between items-center py-3 border-b border-zinc-300">
          <h2 class="uppercase">
            Filters
          </h2>
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
        <div class="flex-1 overflow-y-scroll overflow-x-hidden no-scrollbar">
          <div class="flex flex-col divide-y divide-zinc-300">
            <details class="group">
              <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span class="truncate uppercase">Sort By</span>
                <Icon
                  name="ph:caret-down"
                  class="inline-block shrink-0 size-5! transition group-open:rotate-180"
                />
              </summary>
              <div class="h-0 overflow-hidden group-open:h-auto">
                <div class="flex flex-col pb-4">
                  <button
                    v-for="(option, index) in props.sortOptions"
                    :key="index"
                    :class="{ underline: route.query.sort === option.value || (option.value === null && !route.query.sort) }"
                    class="max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px]"
                    @click="setSortOption(option.value)"
                  >
                    <span>{{ option.label }}</span>
                  </button>
                </div>
              </div>
            </details>
            <details
              v-for="group in props.filterOptions"
              :key="group.label"
              class="group"
            >
              <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span class="truncate uppercase">{{ group.label }}</span>
                <Icon
                  name="ph:caret-down"
                  class="inline-block shrink-0 size-5! transition group-open:rotate-180"
                />
              </summary>
              <div class="h-0 overflow-hidden group-open:h-auto">
                <div class="flex flex-col pb-4">
                  <button
                    v-for="option in group.values"
                    :key="option.id"
                    :class="{ 'underline border-black': (route.query.filter as string[])?.includes(option.id) }"
                    class="flex items-center gap-3 max-w-fit normal-case decoration-dotted decoration-1 underline-offset-[3px]"
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
            </details>
          </div>
        </div>
        <div class="flex flex-col gap-3 py-4 bg-white border-t border-zinc-300">
          <button
            type="button"
            class="flex items-center justify-center uppercase"
            @click="clearAllFilters"
          >
            <span>Clear All Filters ({{ props.activeFilterCount }})</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center p-2 px-4 uppercase bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
            @click="closeFilter"
          >
            <span>View Products</span>
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
