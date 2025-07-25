<script setup lang="ts">
// Links
const navLinksLeft = [
  { label: 'Shop', path: '/collections/latest' },
  { label: 'Catalog', path: '/collections/latest' },
  { label: 'About', path: '/collections/latest' },
]

const navLinksRight = [
  { label: 'Account', path: '/account' },
]

// Stores
const cartStore = useCartStore()
const shopStore = useShopStore()

// Computed
const countryCode = computed(() => shopStore.buyerCountryCode)
const currencySymbol = computed(() => shopStore.buyerCurrencySymbol)
const cartTotalItems = computed(() => cartStore.lineItemCount)

// Emits
const emit = defineEmits<{
  toggleLocaleModal: []
  toggleSearchMenu: []
  toggleCartDrawer: []
}>()

// Emit events
const toggleLocaleModal = () => {
  emit('toggleLocaleModal')
}

const toggleSearchMenu = () => {
  emit('toggleSearchMenu')
}

const toggleCartDrawer = () => {
  emit('toggleCartDrawer')
}
</script>

<template>
  <nav class="hidden grid-cols-[1fr_max-content_1fr] min-h-(--header-height) px-4 lg:grid">
    <div class="grid grid-flow-col justify-start items-center">
      <NuxtLink
        v-for="link in navLinksLeft"
        :key="link.label"
        :to="link.path"
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 hover:bg-zinc-100"
      >
        <span>{{ link.label }}</span>
      </NuxtLink>
    </div>
    <div class="flex items-center">
      <NuxtLink
        id="logo"
        to="/"
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 hover:bg-zinc-100"
      >
        <span>Nitrogen</span>
      </NuxtLink>
    </div>
    <div class="grid grid-flow-col justify-end items-center">
      <button
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 hover:bg-zinc-100"
        @click="toggleLocaleModal"
      >
        <span>{{ countryCode }} / {{ currencySymbol }}</span>
      </button>
      <NuxtLink
        v-for="link in navLinksRight"
        :key="link.label"
        :to="link.path"
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 hover:bg-zinc-100"
      >
        <span>{{ link.label }}</span>
      </NuxtLink>
      <button
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 hover:bg-zinc-100"
        @click="toggleSearchMenu"
      >
        <span>Search</span>
      </button>
      <button
        class="px-2.5 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 hover:bg-zinc-100"
        @click="toggleCartDrawer"
      >
        <span>Cart ({{ cartTotalItems }})</span>
      </button>
    </div>
  </nav>
</template>
