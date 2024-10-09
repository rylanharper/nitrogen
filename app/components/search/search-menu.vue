<script setup lang="ts">
import type { PredictiveSearchQueryVariables } from '@@/types/shopify';

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// Refs
const searchQuery = ref('');

// Debounce search query
const setDebouncedQuery = debounce((query: string) => {
  searchQuery.value = query;
}, 200);

// Shopify
const shopify = useShopify();

// Fetch data
const searchVars = computed<PredictiveSearchQueryVariables>(() => ({
  query: searchQuery.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data: searchData } = await fetchData('predictiveSearch', searchVars, shopify.search.predictive);

// Computed data
const products = computed(() => searchData.value?.products || []);

// Close search
function closeSearch() {
  appStore.searchMenuOpen = false
}

// Handle keydown event
async function handleSearchSubmit() {
  if (searchQuery.value) {
    await navigateTo({
      path: '/search',
      query: { q: searchQuery.value }
    });

    closeSearch();
  }
}

// Watchers
const route = useRoute()
const { escape } = useMagicKeys()

watch(
  () => appStore.searchMenuOpen,
  (isOpen) => {
    if (!isOpen) {
      searchQuery.value = '';
    }
  }
);

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
  <search-menu-desktop
    :products="products"
    :searchQuery="searchQuery"
    @setDebouncedQuery="setDebouncedQuery"
    @handleSearchSubmit="handleSearchSubmit"
  />
  <search-menu-mobile
    :products="products"
    :searchQuery="searchQuery"
    @setDebouncedQuery="setDebouncedQuery"
    @handleSearchSubmit="handleSearchSubmit"
  />
</template>
