<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// State
const searchQuery = ref('');
const searchResults = ref<ProductFragment[]>([]);

// Shopify
const shopify = useShopify();

// Search
const handleSearch = async (query: string) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    searchResults.value = [];
    return;
  }

  searchQuery.value = trimmedQuery;

  try {
    const response = await shopify.search.predictive({
      query: trimmedQuery,
      country: shopStore.buyerCountryCode,
      language: shopStore.buyerLanguageCode,
    });

    searchResults.value = response?.products || [];
  } catch (error: any) {
    console.error('Connot get predictive search data:', error.message);
  }
};

// Debounce query
const debounceQuery = useDebounceFn(handleSearch, 300);

// Actions
const closeSearch = () => {
  appStore.searchMenuOpen = false;
};

const submitQuery = async () => {
  if (searchQuery.value) {
    await navigateTo({
      path: '/search',
      query: { q: searchQuery.value }
    });

    closeSearch();
  }
};

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
    closeSearch();
  });
}
</script>

<template>
  <SearchMenuDesktop
    :products="searchResults"
    :search-query="searchQuery"
    @close-search="closeSearch"
    @debounce-query="debounceQuery"
    @submit-query="submitQuery"
  />
  <SearchMenuMobile
    :products="searchResults"
    :search-query="searchQuery"
    @close-search="closeSearch"
    @debounce-query="debounceQuery"
    @submit-query="submitQuery"
  />
</template>
