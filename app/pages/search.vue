<script setup lang="ts">
import type {
  SearchQueryVariables,
  SearchFiltersQueryVariables,
  ProductFragment,
  FilterFragment,
  PageInfoFragment,
} from '@@/types/shopify-storefront'

import { getSearchSortValues, getFilterValues } from '@/helpers/shopify'

// Route data
const route = useRoute()
const router = useRouter()
const searchTerm = computed(() => route.query.q as string)

// Stores
const appStore = useAppStore()
const shopStore = useShopStore()

// Sort params/values
const sortParam = computed(() => route.query.sort as string | null)
const sortValues = computed(() => getSearchSortValues(sortParam.value))

// Filter params/values
const filterParam = computed(() => route.query)
const filterValues = computed(() => getFilterValues(filterParam.value))

// Get the active filter options from URL query
const activeFilterOptions = computed(() => {
  const filters: { name: string, value: string }[] = []
  const allowedParams = ['sort', 'color', 'size', 'productType']

  Object.entries(route.query).forEach(([name, value]) => {
    if (!value || !allowedParams.includes(name)) return

    if (name === 'sort') {
      filters.push({ name, value: value as string })
    } else {
      (value as string).split(',').forEach((filterValue) => {
        filters.push({ name, value: filterValue })
      })
    }
  })

  return filters
})

// State
const limit = 12
const itemsPerPage = ref(Number(route.query.limit) || limit)

// Shopify
const shopify = useShopify()

// Fetch Shopify data
const searchVars = computed<SearchQueryVariables>(() => ({
  searchTerm: searchTerm.value,
  first: itemsPerPage.value,
  reverse: sortValues.value.reverse,
  sortKey: sortValues.value.sortKey,
  filters: filterValues.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const filterVars = computed<SearchFiltersQueryVariables>(() => ({
  searchTerm: searchTerm.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const [searchQuery, filterQuery] = await Promise.all([
  useAsyncData(
    `search-${searchTerm.value}`,
    () => shopify.search.get(searchVars.value),
    { watch: [searchVars] },
  ),
  useAsyncData(
    `filter-${searchTerm.value}`,
    () => shopify.search.getFilters(filterVars.value),
    { watch: [filterVars] },
  ),
])

const { data: searchData, error: searchError } = searchQuery
const { data: filterData, error: filterError } = filterQuery

// Response data
const search = computed(() => searchData.value)
const searchFilter = computed(() => filterData.value)

// Access data nodes
const products = computed(() => flattenConnection(search.value) as ProductFragment[])
const filterIds = computed(() => flattenConnection(searchFilter.value) as ProductFragment[])

// Computed data
const pageInfo = computed(() => search.value?.pageInfo as PageInfoFragment)
const filters = computed(() => searchFilter.value?.filters as FilterFragment[])

// Number of products
const numberOfProducts = computed<number>(() => {
  return filterValues.value.length
    ? products.value.length
    : filterIds.value.length
})

// Actions
const loadMoreProducts = () => {
  const productLimit = itemsPerPage.value += limit

  router.replace({
    path: route.path,
    query: { ...route.query, limit: productLimit },
  })
}

const removeActiveFilterOption = (filterName: string, filterValue: string) => {
  const query = { ...route.query }

  if (filterName === 'sort') {
    delete query.sort
  } else {
    const currentValues = (route.query[filterName] as string)?.split(',') || []
    const newValues = currentValues.filter((value) => value !== filterValue)

    if (newValues.length > 0) {
      query[filterName] = newValues.join(',')
    } else {
      delete query[filterName]
    }
  }

  router.replace({
    path: route.path,
    query,
  })
}

const toggleFilter = () => {
  appStore.toggle('filterMenu')
}

// SEO
const pageTitle = computed(() =>
  searchTerm.value
    ? `Search: ${numberOfProducts.value} results found for "${searchTerm.value}"`
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
        class="inline-block shrink-0 !size-5"
      />
      <p class="text-normalize">
        503: No Shopify data found.
      </p>
    </div>
  </div>

  <div
    v-else-if="!products.length && !filters.length"
    class="wrapper px-6 my-6"
  >
    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-2.5">
        <Icon
          name="ph:warning-circle"
          class="inline-block shrink-0 !size-5"
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
          Results for "{{ searchTerm }}" ({{ numberOfProducts }})
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
              class="flex items-center justify-center p-2 px-4 gap-2.5 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-500"
              @click="removeActiveFilterOption(option.name, option.value)"
            >
              <span>{{ option.value }}</span>
              <Icon
                name="ph:x"
                class="inline-block shrink-0 !size-4"
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
          class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
          @click="toggleFilter"
        >
          <span>Filter & Sort</span>
        </button>
      </div>
    </section>
    <!-- Products -->
    <section class="flex flex-col">
      <div
        v-if="products && products.length"
        class="flex flex-col gap-10"
      >
        <div class="grid grid-cols-2 auto-rows-fr gap-x-6 gap-y-8 w-full lg:grid-cols-4 lg:gap-y-12">
          <div
            v-for="product in products"
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
            class="flex items-center justify-center p-2 px-4 text-normalize bg-transparent border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-100"
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
          class="inline-block shrink-0 !size-5"
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
