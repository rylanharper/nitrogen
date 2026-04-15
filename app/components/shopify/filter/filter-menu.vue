<script setup lang="ts">
import type { FilterFragment } from '@@/types/shopify-storefront'
import type { LocationQuery } from 'vue-router'

import { useMagicKeys } from '@vueuse/core'
import { normalizeFilterQuery } from '@/helpers/shopify'

// Props
const props = defineProps<{
  filters: FilterFragment[]
}>()

// Composables
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// Sort options
const searchSortOptions = [
  { label: 'Relevance', value: null },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
]

const collectionSortOptions = [
  { label: 'Recommended', value: null },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'New Arrivals', value: 'newest' },
]

const sortOptions = computed(() => {
  return route.path.includes('/search')
    ? searchSortOptions
    : collectionSortOptions
})

// Get active filter count from URL query
const activeFilterCount = computed(() => {
  const { sort, filter } = route.query
  return (sort ? 1 : 0) + normalizeFilterQuery(filter).length
})

// Filter options
const filterOptions = computed(() => {
  return props.filters
    ?.filter((filter) => !filter.values[0]?.id.startsWith('filter.v.availability'))
    .map((filter) => ({
      label: filter.label,
      values: filter.values.map((value) => ({
        count: value.count,
        id: value.id,
        label: value.label,
        swatch: value.swatch,
      })),
    })) ?? []
})

// Actions
const setSortOption = (sortValue: string | null) => {
  const query: LocationQuery = { ...route.query }
  query.sort = sortValue ?? undefined as any
  router.replace({ query })
}

const setFilterOption = (filterId: string) => {
  const query: LocationQuery = { ...route.query }
  const current = normalizeFilterQuery(query.filter)

  const newFilters = current.includes(filterId)
    ? current.filter((f) => f !== filterId)
    : [...current, filterId]

  query.filter = newFilters.length ? newFilters : undefined as any
  router.replace({ query })
}

const clearAllFilters = () => {
  const preserveKeys = ['q', 'limit']
  const query: LocationQuery = Object.fromEntries(
    Object.entries(route.query).filter(([key]) => preserveKeys.includes(key)),
  )
  router.replace({ query })
}

const closeFilter = () => appStore.toggle('filterMenu', false)

// Watchers
const { escape } = useMagicKeys()
if (escape) watch(escape, closeFilter)
</script>

<template>
  <FilterMenuMobile
    :sort-options="sortOptions"
    :filter-options="filterOptions"
    :active-filter-count="activeFilterCount"
    @close-filter="closeFilter"
    @set-sort-option="setSortOption"
    @set-filter-option="setFilterOption"
    @clear-all-filters="clearAllFilters"
  />
  <FilterMenuDesktop
    :sort-options="sortOptions"
    :filter-options="filterOptions"
    :active-filter-count="activeFilterCount"
    @close-filter="closeFilter"
    @set-sort-option="setSortOption"
    @set-filter-option="setFilterOption"
    @clear-all-filters="clearAllFilters"
  />
</template>
