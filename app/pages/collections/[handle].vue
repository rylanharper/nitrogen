<script setup lang="ts">
import type {
  CollectionQueryVariables,
  CollectionFiltersQueryVariables,
  FilterFragment,
  ProductFragment,
  PageInfoFragment,
} from '@@/types/shopify-storefront'

import { getCollectionSortValues, getFilterValues } from '@/helpers/shopify'
import { flattenConnection } from '@/utils/graphql'

// Route data
const route = useRoute()
const router = useRouter()
const handle = computed(() => route.params.handle as string)

// Stores
const appStore = useAppStore()
const shopStore = useShopStore()

// Sort params/values
const sortParam = computed(() => route.query.sort as string | null)
const sortValues = computed(() => getCollectionSortValues(sortParam.value))

// Filter params/values
const filterParam = computed(() => route.query)
const filterValues = computed(() => getFilterValues(filterParam.value))

// Get the active filter options from URL query
const activeFilterOptions = computed(() => {
  const allowedParams = ['sort', 'color', 'size', 'productType']

  return Object.entries(route.query)
    .filter(([name, value]) => value && allowedParams.includes(name))
    .flatMap(([name, value]) => {
      const values = name === 'sort'
        ? [value as string]
        : (value as string).split(',')
      return values.map((value) => ({ name, value: value }))
    })
})

// State
const limit = 12
const itemsPerPage = ref(Number(route.query.limit) || limit)

// Shopify
const shopify = useShopify()

// Fetch Shopify data
const collectionVars = computed<CollectionQueryVariables>(() => ({
  handle: handle.value,
  first: itemsPerPage.value,
  reverse: sortValues.value.reverse,
  sortKey: sortValues.value.sortKey,
  filters: filterValues.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const filterVars = computed<CollectionFiltersQueryVariables>(() => ({
  handle: handle.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const [collectionQuery, filterQuery] = await Promise.all([
  useAsyncData(
    `collection-${handle.value}`,
    () => shopify.collection.get(collectionVars.value),
    { watch: [collectionVars] },
  ),
  useAsyncData(
    `filter-${handle.value}`,
    () => shopify.collection.getFilters(filterVars.value),
    { watch: [filterVars] },
  ),
])

const { data: collectionData, error: collectionError } = collectionQuery
const { data: filterData, error: filterError } = filterQuery

// Response data
const collection = computed(() => collectionData.value)
const collectionFilter = computed(() => filterData.value)

// Access data nodes
const products = computed(() => flattenConnection(collection.value?.products) as ProductFragment[])
const filterIds = computed(() => flattenConnection(collectionFilter.value?.products) as ProductFragment[])

// Computed data
const pageInfo = computed(() => collection.value?.products?.pageInfo as PageInfoFragment)
const filters = computed(() => collectionFilter.value?.products?.filters as FilterFragment[])

// Number of products
const numberOfProducts = computed<number>(() => {
  return filterValues.value.length ? products.value.length : filterIds.value.length
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
        class="inline-block shrink-0 !size-5"
      />
      <p class="text-normalize">
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
