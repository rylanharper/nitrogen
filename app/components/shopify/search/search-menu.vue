<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify-storefront';

import { useDebounceFn, useMagicKeys } from '@vueuse/core';

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// State
const searchQuery = ref('');
const searchResults = ref<ProductFragment[]>([]);

// Shopify
const shopify = useShopify();

// Search (predictive)
const handleSearch = useDebounceFn(async () => {
  const trimmedQuery = searchQuery.value.trim();

  if (!trimmedQuery) {
    searchResults.value = [];
    return;
  }

  const response = await shopify.search.predictive({
    query: trimmedQuery,
    country: shopStore.buyerCountryCode,
    language: shopStore.buyerLanguageCode,
  });

  searchResults.value = response?.products || [];
}, 300);

// Actions
const closeSearch = () => {
  appStore.toggle('searchMenu', false);
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

watch(searchQuery, () => {
  handleSearch();
});

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
    v-model="searchQuery"
    :products="searchResults"
    @close-search="closeSearch"
    @submit-query="submitQuery"
  />
  <SearchMenuMobile
    v-model="searchQuery"
    :products="searchResults"
    @close-search="closeSearch"
    @submit-query="submitQuery"
  />
</template>
