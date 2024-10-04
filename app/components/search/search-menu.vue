<script setup lang="ts">
import type { PredictiveSearchQueryVariables } from '@@/types/shopify';

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// Composables
const shopify = useShopify();

// Refs
const searchQuery = ref('');

// Debounce search query
const setDebouncedQuery = debounce((query: string) => {
  searchQuery.value = query;
}, 350);

// Fetch data
const searchVars = computed<PredictiveSearchQueryVariables>(() => ({
  query: searchQuery.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data: searchData } = await fetchData(searchVars, 'predictiveSearch', shopify.search.predictive);

// Computed data
const products = computed(() => searchData.value?.products || []);

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
