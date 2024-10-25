<script setup lang="ts">
import type {
  PredictiveSearchQueryVariables,
  ProductFragment
} from '@@/types/shopify';

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// Refs
const searchQuery = ref('');
const searchResults = ref<ProductFragment[]>([]);

// Shopify
const shopify = useShopify();

// Debounce search query
const setDebouncedQuery = useDebounceFn(async (query: string) => {
  searchQuery.value = query;

  if (searchQuery.value) {
    const searchVars: PredictiveSearchQueryVariables = {
      query,
      country: shopStore.buyerCountryCode,
      language: shopStore.buyerLanguageCode
    };

    try {
      const result = await shopify.search.predictive(searchVars);
      searchResults.value = result?.products || [];
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }
}, 300);

// Close search
function closeSearch() {
  appStore.searchMenuOpen = false;
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
const route = useRoute();
const { escape } = useMagicKeys();

watch(
  () => appStore.searchMenuOpen,
  (isOpen) => {
    if (!isOpen) {
      searchQuery.value = '';
      searchResults.value = [];
    }
  }
);

watch(
  () => route.path,
  () => {
    closeSearch();
  }
);

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
    :products="searchResults"
    :searchQuery="searchQuery"
    @closeSearch="closeSearch"
    @setDebouncedQuery="setDebouncedQuery"
    @handleSearchSubmit="handleSearchSubmit"
  />
  <search-menu-mobile
    :products="searchResults"
    :searchQuery="searchQuery"
    @closeSearch="closeSearch"
    @setDebouncedQuery="setDebouncedQuery"
    @handleSearchSubmit="handleSearchSubmit"
  />
</template>
