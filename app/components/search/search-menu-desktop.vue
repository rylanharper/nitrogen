<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify'

// Props
const props = defineProps<{
  products: ProductFragment[]
  searchQuery: string
}>()

// Route
const route = useRoute()

// Stores
const appStore = useAppStore()

// Refs
const input = ref<HTMLInputElement | null>(null)

// Composables
const { getColorOption } = useProductHelpers()

// Suggested links
const defaulSearchtLinks = [
  { label: 'Mens tops', path: '/' },
  { label: 'Womens tops', path: '/' },
  { label: 'Womens Pants', path: '/' }
]

// Emits
const emit = defineEmits(['setDebouncedQuery', 'handleSearchSubmit'])

// Handle input
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('setDebouncedQuery', target.value)
}

// Handle keydown (Enter key)
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    emit('handleSearchSubmit')
  }
}

// Close search menu
function closeSearch() {
  appStore.searchMenuOpen = false
}

// Watchers
const { escape } = useMagicKeys()

watch(
  () => appStore.searchMenuOpen,
  () => {
    nextTick(() => {
      input.value?.focus()
    })
  }
)

watch(
  () => route.path,
  () => {
    closeSearch()
  }
)

if (escape) {
  watch(escape, () => {
    if (appStore.searchMenuOpen) {
      closeSearch();
    }
  });
}
</script>

<template>
  <transition name="slider" mode="out-in" appear>
    <aside v-if="appStore.searchMenuOpen" class="hidden fixed top-0 z-[80] w-full bg-white lg:flex lg:min-h-[400px]">
      <div class="flex flex-col gap-6 w-full px-6 pt-14 pb-10 mx-auto xl:max-w-7xl">
        <div class="relative w-full">
          <input
            ref="input"
            id="searchInput"
            name="searchInput"
            type="text"
            placeholder="Search products"
            @input="handleInput"
            @keydown="handleKeyDown"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            class="peer flex w-full py-2 pl-8 normal-case bg-white border-b border-zinc-300 appearance-none placeholder:text-zinc-400 focus:border-black focus:outline-transparent"
          />
          <div class="absolute flex inset-y-0 start-0 items-center text-zinc-400 peer-focus:text-black">
            <Icon name="ph:magnifying-glass" class="h-5 w-5 shrink-0"/>
          </div>
          <div
            @click="closeSearch"
            class="absolute flex inset-y-0 end-0 items-center text-zinc-400 peer-focus:text-black active:text-black cursor-pointer"
          >
            <Icon name="ph:x" class="h-5 w-5 shrink-0"/>
          </div>
        </div>
        <div class="grid grid-cols-8 gap-10">
          <div class="col-span-2">
            <h3 class="text-sm mb-2.5">Suggestions</h3>
            <div v-if="searchQuery.length && products?.length" class="flex flex-col">
              <nuxt-link
                v-for="product in props.products"
                :key="product.id"
                :to="`/products/${product.handle}`"
              >
                <span v-if="getColorOption(product.options)">
                  {{ product?.title }} {{ getColorOption(product.options)?.optionValues[0]?.name }}
                </span>
                <span v-else>{{ product?.title }}</span>
              </nuxt-link>
            </div>
            <div v-else class="flex flex-col">
              <nuxt-link
                v-for="link in defaulSearchtLinks"
                :key="link.label"
                :to="link.path"
              >
                {{ link.label }}
              </nuxt-link>
            </div>
          </div>
          <div class="col-span-6">
            <h3 class="text-sm mb-3">Products</h3>
            <div v-if="products?.length" class="grid grid-cols-2 gap-x-2 gap-y-6">
              <nuxt-link
                v-for="product in props.products"
                :key="product.id"
                :to="`/products/${product.handle}`"
                class="flex gap-4"
              >
                <div class="w-24 shrink-0">
                  <shopify-image
                    :image="product.featuredImage"
                    :alt="product.featuredImage.altText || product.title"
                  />
                </div>
                <div class="flex flex-col flex-1">
                  <div class="mb-1">
                    <h2 v-if="product.title" class="leading-tight">{{ product.title }}</h2>
                    <h3 v-if="getColorOption(product.options)" class="normal-case">
                      {{ getColorOption(product.options)?.optionValues[0]?.name }}
                    </h3>
                  </div>
                  <price-display
                    :price="product?.priceRange?.minVariantPrice"
                    :compare-at-price-range="product?.compareAtPriceRange?.minVariantPrice"
                  />
                </div>
              </nuxt-link>
            </div>
            <div v-else class="flex items-center gap-2">
              <Icon name="ph:seal-warning" class="h-5 w-5 shrink-0" />
              <p class="normal-case">There are no matching products.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </transition>
  <transition name="fade" mode="out-in" appear>
    <div
      v-if="appStore.searchMenuOpen"
      @click="closeSearch"
      class="hidden fixed inset-0 z-[50] pointer-events-auto bg-black/50 lg:flex"
    />
  </transition>
</template>

<style lang="css" scoped>
.slider-enter-active,
.slider-leave-active {
  @apply transform translate-x-0 lg:translate-y-0;
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
