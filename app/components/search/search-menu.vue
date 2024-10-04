<script setup lang="ts">
import type { PredictiveSearchQueryVariables } from '@@/types/shopify';
import { useShopStore } from '@/stores/shop';
import { useShopify } from '@/composables/use-shopify';
import { debounce } from '@/utils/debounce';

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// Refs
const searchQuery = ref('');

// Debounce search query
const setDebouncedQuery = debounce((query: string) => {
  searchQuery.value = query;
}, 350);

// Composables
const shopify = useShopify();

// Fetch data
const variables = computed<PredictiveSearchQueryVariables>(() => ({
  query: searchQuery.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data, error } = await useAsyncData('predictiveSearch', () =>
  shopify.search.predictive(variables.value), {
    watch: [variables]
  }
);

if (error.value) {
  console.error('Error fetching predictiveSearch data', error.value);
}

// Computed data
const products = computed(() => data.value?.products || []);

// Handle keydown event
async function handleSearchSubmit() {
  if (!!searchQuery.value) {
    await navigateTo({
      path: '/search',
      query: { q: searchQuery.value }
    });

    appStore.searchMenuOpen = false;
  }
}

// Watchers
watch(
  () => appStore.searchMenuOpen,
  (isOpen) => {
    if (!isOpen) {
      searchQuery.value = '';
    }
  }
);
</script>

<template>
  <search-menu-desktop
    :products="products"
    :searchQuery="searchQuery"
    @setDebouncedQuery="setDebouncedQuery"
    @handleSearchSubmit="handleSearchSubmit"
  />
</template>
