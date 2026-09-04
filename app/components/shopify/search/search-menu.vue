<script setup lang="ts">
import type {
  PredictiveSearchQueryVariables,
  ProductFragment,
} from '#shopify/storefront'

import { PREDICTIVE_SEARCH } from '@@/graphql/queries/search'
import { useDebounceFn, useMagicKeys } from '@vueuse/core'

// Composables
const route = useRoute()
const appStore = useAppStore()
const shopStore = useShopStore()

// State
const searchQuery = ref('')
const searchResults = ref<ProductFragment[]>([])

// Search vars
const searchVars = computed<PredictiveSearchQueryVariables>(() => ({
  query: searchQuery.value.trim(),
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

// Search (predictive)
const handleSearch = useDebounceFn(async () => {
  if (!searchVars.value.query) {
    searchResults.value = []
    return
  }

  const { data } = await useStorefront().request(PREDICTIVE_SEARCH, {
    variables: searchVars.value,
  })

  searchResults.value = data?.predictiveSearch?.products as ProductFragment[]
}, 300)

// Actions
const closeSearch = () => {
  appStore.toggle('searchMenu', false)
}

const submitQuery = async () => {
  if (searchQuery.value) {
    await navigateTo({
      path: '/search',
      query: { q: searchQuery.value.trim() },
    })
    closeSearch()
  }
}

// Watchers
const { escape } = useMagicKeys()

watch(searchQuery, handleSearch)
watch(() => route.path, closeSearch)
if (escape) watch(escape, closeSearch)
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
