<script setup lang="ts">
// Links
const navLinksLeft = [
  { label: 'Shop', path: '/' },
  { label: 'Catalog', path: '/' },
  { label: 'About', path: '/' }
];

const navLinksRight = [
  { label: 'Account', path: '/account' }
];

// Stores
const cartStore = useCartStore();
const shopStore = useShopStore();

// Computed
const countryCode = computed(() => shopStore.buyerCountryCode);
const currencySymbol = computed(() => shopStore.buyerCurrencySymbol);
const cartTotalItems = computed(() => cartStore.lineItemsCount);

// Emits
const emit = defineEmits([
  'toggleLocaleModal',
  'toggleSearchMenu',
  'toggleCartDrawer'
]);
</script>

<template>
  <nav class="hidden grid-cols-[1fr_max-content_1fr] min-h-[--header-height] px-4 lg:grid">
    <div class="grid grid-flow-col justify-start items-center">
      <nuxt-link
        v-for="link in navLinksLeft"
        :key="link.label"
        :to="link.path"
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 ease-in-out hover:bg-zinc-100"
      >
        {{ link.label }}
      </nuxt-link>
    </div>
    <div class="flex items-center">
      <nuxt-link
        to="/"
        id="logo"
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 ease-in-out hover:bg-zinc-100"
      >
        Nitrogen
      </nuxt-link>
    </div>
    <div class="grid grid-flow-col justify-end items-center">
      <button
        @click="$emit('toggleLocaleModal')"
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 ease-in-out hover:bg-zinc-100"
      >
        {{ countryCode }} / {{ currencySymbol }}
      </button>
      <nuxt-link
        v-for="link in navLinksRight"
        :key="link.label"
        :to="link.path"
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 ease-in-out hover:bg-zinc-100"
      >
        {{ link.label }}
      </nuxt-link>
      <button
        @click="$emit('toggleSearchMenu')"
        class="px-2 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 ease-in-out hover:bg-zinc-100"
      >
        Search
      </button>
      <button
        @click="$emit('toggleCartDrawer')"
        class="px-2.5 py-0.5 text-normalize bg-transparent rounded-md transition duration-200 ease-in-out hover:bg-zinc-100"
      >
        Cart ({{ cartTotalItems }})
      </button>
    </div>
  </nav>
</template>
