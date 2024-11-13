<script setup lang="ts">
import type {
  PredictiveSearchQueryVariables,
  ProductFragment,
} from '@@/types/shopify';

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// State
const searchQuery = ref('');
const searchResults = ref<ProductFragment[]>([]);

// Shopify
const shopify = useShopify();

// Debounce query
const handleSearch = async (query: string) => {
  searchQuery.value = query;

  if (searchQuery.value) {
    const searchVars: PredictiveSearchQueryVariables = {
      query,
      country: shopStore.buyerCountryCode,
      language: shopStore.buyerLanguageCode,
    };

    try {
      const response = await shopify.search.predictive(searchVars);
      searchResults.value = response?.products || [];
    }
    catch (error) {
      console.error('Error fetching predictive search data.', error);
    }
  }
};

const debounceQuery = useDebounceFn(handleSearch, 300);

// Actions
const closeSearch = () => {
  appStore.searchMenuOpen = false;
};

const submitQuery = async () => {
  if (searchQuery.value) {
    await navigateTo({
      path: '/search',
      query: { q: searchQuery.value },
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
  },
);

watch(
  () => route.path,
  () => {
    closeSearch();
  },
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
