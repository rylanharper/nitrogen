<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify'

// Props
const props = defineProps<{
  products: ProductFragment[]
  searchQuery: string
}>()

// Stores
const appStore = useAppStore()

// Refs
const input = ref<HTMLInputElement | null>(null)

// Emits
const emit = defineEmits([
  'closeSearch',
  'setDebouncedQuery',
  'handleSearchSubmit'
])

// Emit events
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('setDebouncedQuery', target.value)
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    emit('handleSearchSubmit')
  }
}

function closeSearch() {
  emit('closeSearch');
}

// Helpers
const { getColorOption } = useProductHelpers();

// Computed
const productsWithOptions = computed(() =>
  props.products.map(product => {
    const productOptions = product.options;
    const productOptionColor = getColorOption(productOptions);
    const colorOptionName = productOptionColor?.optionValues[0]?.name;

    return {
      ...product,
      productOptions,
      productOptionColor,
      colorOptionName,
    };
  })
);

// Watchers
watch(
  () => appStore.searchMenuOpen,
  () => {
    nextTick(() => {
      input.value?.focus()
    })
  }
)
</script>

<template>
  <transition name="slider" mode="out-in" appear>
    <aside
      v-if="appStore.searchMenuOpen"
      class="fixed inset-0 z-[200] size-full bg-white lg:hidden"
    >
      <div class="flex flex-col gap-10 size-full px-5">
        <div class="relative flex">
          <input
            ref="input"
            type="text"
            name="searchInput"
            @input="handleInput"
            @keydown="handleKeyDown"
            placeholder="Search products"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            class="peer flex w-full py-3 pl-8 normal-case bg-white border-b border-zinc-300 appearance-none rounded-none placeholder:text-zinc-400 focus:border-black focus:outline-none"
          />
          <div class="absolute flex inset-y-0 start-0 items-center text-zinc-400 peer-focus:text-black select-none">
            <Icon name="ph:magnifying-glass" class="h-5 w-5 shrink-0"/>
          </div>
          <button
            @click="closeSearch"
            class="absolute flex inset-y-0 end-0 items-center text-zinc-400 peer-focus:text-black active:text-black"
          >
            <Icon name="ph:x" class="h-5 w-5 shrink-0"/>
          </button>
        </div>
        <div class="flex flex-col flex-1 overflow-y-scroll overflow-x-hidden no-scrollbar">
          <div v-if="searchQuery.length && products?.length" class="grid grid-cols-2 gap-x-2 gap-y-8 w-full">
            <nuxt-link
              v-for="product in productsWithOptions"
              :key="product.id"
              :to="`/products/${product.handle}`"
              class="flex gap-4"
            >
              <div class="w-24 aspect-square shrink-0">
                <shopify-image
                  :image="product.featuredImage"
                  :alt="product.featuredImage?.altText || product.title"
                />
              </div>
              <div class="flex flex-col flex-1">
                <div class="mb-1">
                  <h2 v-if="product.title">{{ product.title }}</h2>
                  <h3 v-if="product.productOptionColor" class="normal-case">
                    {{ product.colorOptionName }}
                  </h3>
                </div>
                <price-display
                  :price="product.priceRange?.minVariantPrice"
                  :compareAtPriceRange="product.compareAtPriceRange?.minVariantPrice"
                />
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </aside>
  </transition>
  <transition name="fade" mode="out-in" appear>
    <div
      v-if="appStore.searchMenuOpen"
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
