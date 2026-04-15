<script setup lang="ts">
import type {
  SearchQueryVariables,
  SearchFiltersQueryVariables,
  FilterFragment,
  ProductFragment,
  PageInfoFragment,
} from '@@/types/shopify-storefront'

import { getSearchSortValues, getFilterValues } from '@/helpers/shopify'

// Composables
const route = useRoute()
const shopify = useShopify()
const appStore = useAppStore()
const shopStore = useShopStore()

// URL query
const query = computed(() => route.query.q as string)

// Filter query
const filterVars = computed<SearchFiltersQueryVariables>(() => ({
  query: query.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const { data: filterData, error: filterError } = await useAsyncData(
  `filter-${query.value}`,
  () => shopify.search.getFilters(filterVars.value),
  { watch: [filterVars] },
)

// Filter response data
const filter = computed(() => filterData.value)
const filters = computed(() => filter.value?.filters as FilterFragment[])

// Filter data nodes
const filterProducts = computed(() => flattenConnection(filter.value) as ProductFragment[])

// Get active URL filters
const { activeFilterOptions, removeActiveFilterOption } = useActiveFilters(filters)

// Sort/filter params
const sortParam = computed(() => route.query.sort as string | null)
const sortValues = computed(() => getSearchSortValues(sortParam.value))
const filterValues = computed(() => getFilterValues(route.query, filters.value))

// Pagination
const { itemsPerPage, loadMoreProducts } = usePagination()

// Search query
const searchVars = computed<SearchQueryVariables>(() => ({
  query: query.value,
  first: itemsPerPage.value,
  reverse: sortValues.value.reverse,
  sortKey: sortValues.value.sortKey,
  filters: filterValues.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const { data: searchData, error: searchError } = await useAsyncData(
  `search-${query.value}`,
  () => shopify.search.get(searchVars.value),
  { watch: [searchVars] },
)

// Search response data
const search = computed(() => searchData.value)
const pageInfo = computed(() => search.value?.pageInfo as PageInfoFragment)

// Search data nodes
const searchProducts = computed(() => flattenConnection(search.value) as ProductFragment[])

// Calculate number of products
const numberOfProducts = computed(() => filterValues.value.length ? searchProducts.value.length : filterProducts.value.length)

// Actions
const toggleFilter = () => appStore.toggle('filterMenu')

// SEO
const pageTitle = computed(() =>
  query.value
    ? `Search: ${numberOfProducts.value} results found for "${query.value}"`
    : 'Search',
)

useHead(() => ({
  title: pageTitle.value,
}))
</script>

<template>
  <div
    v-if="searchError && filterError"
    class="fixed top-(--header-height) left-0 w-full h-fit text-zinc-100 bg-line-pattern border-b border-zinc-200"
  >
    <div class="flex items-center justify-center gap-2.5 py-2">
      <Icon
        name="ph:warning-circle"
        class="inline-block shrink-0 size-5!"
      />
      <p class="uppercase">
        503: No Shopify data found.
      </p>
    </div>
  </div>

  <div
    v-else-if="!searchProducts.length && !filters.length"
    class="wrapper px-6 my-6"
  >
    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-2.5">
        <Icon
          name="ph:warning-circle"
          class="inline-block shrink-0 size-5!"
        />
        <p>No search results found.</p>
      </div>
    </section>
  </div>

  <div
    v-else-if="search"
    class="wrapper px-6 mb-20"
  >
    <!-- Header -->
    <section class="grid my-6 grid-cols-[1fr_max-content_1fr]">
      <div class="col-start-1 flex justify-start items-center">
        <h1 class="text-xl tracking-tight leading-none">
          Results for "{{ query }}" ({{ numberOfProducts }})
        </h1>
      </div>
      <div class="col-start-auto hidden lg:flex">
        <div
          v-if="activeFilterOptions.length"
          class="flex flex-wrap gap-2"
        >
          <div
            v-for="option in activeFilterOptions"
            :key="option.value"
          >
            <button
              class="flex items-center justify-center p-2 px-4 gap-2.5 uppercase bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-500"
              @click="removeActiveFilterOption(option.name, option.id)"
            >
              <span>{{ option.value }}</span>
              <Icon
                name="ph:x"
                class="inline-block shrink-0 size-4!"
              />
            </button>
          </div>
        </div>
        <span
          v-else
          class="invisible"
        />
      </div>
      <div class="col-start-3 flex justify-end items-center">
        <button
          class="flex items-center justify-center p-2 px-4 uppercase bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
          @click="toggleFilter"
        >
          <span>Filter & Sort</span>
        </button>
      </div>
    </section>
    <!-- Products -->
    <section class="flex flex-col">
      <div
        v-if="searchProducts && searchProducts.length"
        class="flex flex-col gap-10"
      >
        <div class="grid grid-cols-2 auto-rows-fr gap-x-6 gap-y-8 w-full lg:grid-cols-4 lg:gap-y-12">
          <div
            v-for="product in searchProducts"
            :key="product.id"
          >
            <ProductCard :product="product" />
          </div>
        </div>
        <div
          v-if="pageInfo?.hasNextPage"
          class="flex justify-center"
        >
          <button
            class="flex items-center justify-center p-2 px-4 uppercase bg-transparent border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-100"
            @click="loadMoreProducts"
          >
            <span>See More Products</span>
          </button>
        </div>
      </div>
      <div
        v-else
        class="flex items-center gap-2.5"
      >
        <Icon
          name="ph:warning-circle"
          class="inline-block shrink-0 size-5!"
        />
        <p>No products found. Try adjusting your filters.</p>
      </div>
    </section>
    <!-- Filters -->
    <FilterMenu
      v-if="filters"
      :filters="filters"
    />
  </div>
</template>
