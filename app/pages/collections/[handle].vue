<script setup lang="ts">
import type {
  CollectionQueryVariables,
  CollectionFiltersQueryVariables,
  FilterFragment,
  ProductFragment,
  PageInfoFragment,
} from '@@/types/shopify-storefront'

import { getCollectionSortValues, getFilterValues } from '@/helpers/shopify'

// Composables
const route = useRoute()
const shopify = useShopify()
const appStore = useAppStore()
const shopStore = useShopStore()

// Handle
const handle = computed(() => route.params.handle as string)

// Filter query
const filterVars = computed<CollectionFiltersQueryVariables>(() => ({
  handle: handle.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const { data: filterData, error: filterError } = await useAsyncData(
  `filter-${handle.value}`,
  () => shopify.collection.getFilters(filterVars.value),
  { watch: [filterVars] },
)

// Filter response data
const filter = computed(() => filterData.value)
const filters = computed(() => filter.value?.products?.filters as FilterFragment[])

// Filter data nodes
const filterProducts = computed(() => flattenConnection(filter.value?.products) as ProductFragment[])

// Get active URL filters
const { activeFilterOptions, removeActiveFilterOption } = useActiveFilters(filters)

// Sort/filter params
const sortParam = computed(() => route.query.sort as string | null)
const sortValues = computed(() => getCollectionSortValues(sortParam.value))
const filterValues = computed(() => getFilterValues(route.query, filters.value))

// Pagination
const { itemsPerPage, loadMoreProducts } = usePagination()

// Collection query
const collectionVars = computed<CollectionQueryVariables>(() => ({
  handle: handle.value,
  first: itemsPerPage.value,
  reverse: sortValues.value.reverse,
  sortKey: sortValues.value.sortKey,
  filters: filterValues.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const { data: collectionData, error: collectionError } = await useAsyncData(
  `collection-${handle.value}`,
  () => shopify.collection.get(collectionVars.value),
  { watch: [collectionVars] },
)

// Collection response data
const collection = computed(() => collectionData.value)
const pageInfo = computed(() => collection.value?.products?.pageInfo as PageInfoFragment)

// Collection data nodes
const collectionProducts = computed(() => flattenConnection(collection.value?.products) as ProductFragment[])

// Calculate number of products
const numberOfProducts = computed(() => filterValues.value.length ? collectionProducts.value.length : filterProducts.value.length)

// Actions
const toggleFilter = () => appStore.toggle('filterMenu')

// SEO
useHead({
  title: collection.value?.title,
})
</script>

<template>
  <div
    v-if="collectionError && filterError"
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
    v-else-if="collection"
    class="wrapper px-6 mb-20"
  >
    <!-- Header -->
    <section class="grid my-6 grid-cols-[1fr_max-content_1fr]">
      <div class="col-start-1 flex justify-start items-center">
        <h1 class="text-xl tracking-tight leading-none">
          {{ collection.title }} ({{ numberOfProducts }})
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
        v-if="collectionProducts && collectionProducts.length"
        class="flex flex-col gap-10"
      >
        <div class="grid grid-cols-2 auto-rows-fr gap-x-6 gap-y-8 w-full lg:grid-cols-4 lg:gap-y-12">
          <div
            v-for="product in collectionProducts"
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
