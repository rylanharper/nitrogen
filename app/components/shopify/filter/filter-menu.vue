<script setup lang="ts">
import type { FilterFragment } from '@@/types/shopify-storefront';

import { useMagicKeys } from '@vueuse/core';

// Props
const props = defineProps<{
  filters: FilterFragment[];
  numberOfProducts?: number
}>();

// Route data
const route = useRoute();
const router = useRouter();

// Stores
const appStore = useAppStore();

// Sort options
const searchSortOptions = [
  { label: 'Relevance', value: null },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' }
];

const collectionSortOptions = [
  { label: 'Recommended', value: null },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'New Arrivals', value: 'newest' }
];

const sortOptions = computed(() => {
  return route.path.includes('/search')
    ? searchSortOptions
    : collectionSortOptions;
});

// Get active filter count from URL query
const activeFilterCount = computed(() => {
  let count = 0;
  const excludedFilters = ['q', 'limit'];

  Object.entries(route.query).forEach(([name, value]) => {
    if (!value || excludedFilters.includes(name)) return;

    if (name === 'sort') {
      count += 1;
    } else {
      count += (value as string).split(',').length;
    }
  });

  return count;
});

// Filter options
const colorOptions = computed(() => {
  const colorFilter = props.filters?.find((filter) => filter.label === 'Filter Color')

  return (
    colorFilter?.values?.map((value) => ({
      count: value.count,
      id: value.id,
      label: value.label,
      swatch: value.swatch,
    })) || []
  )
})

const sizeOptions = computed(() => {
  const sizeFilter = props.filters?.find((filter) => filter.label === 'Size')

  return (
    sizeFilter?.values?.map((value) => ({
      count: value.count,
      id: value.id,
      label: value.label,
    })) || []
  )
})

const productTypeOptions = computed(() => {
  const productTypeFilter = props.filters?.find((filter) => filter.label === 'Product Type')

  return (
    productTypeFilter?.values?.map((value) => ({
      count: value.count,
      id: value.id,
      label: value.label,
    })) || []
  )
})

// Actions
const setSortOption = (sortValue: string | null) => {
  const query = { ...route.query };

  if (sortValue) {
    query.sort = sortValue;
  } else {
    delete query.sort;
  }

  router.replace({
    path: route.path,
    query
  });
};

const setFilterOption = (filterName: string, filterValue: string) => {
  const query = { ...route.query };
  const currentValues = (route.query[filterName] as string)?.split(',') || [];

  const newValues = currentValues.includes(filterValue)
    ? currentValues.filter((value) => value !== filterValue)
    : [...currentValues, filterValue];

  if (newValues.length > 0) {
    query[filterName] = newValues.join(',');
  } else {
    delete query[filterName];
  }

  router.replace({
    path: route.path,
    query
  });
};

const clearAllFilters = () => {
  const query = { ...route.query };
  const excludedFilters = ['q', 'limit'];

  Object.keys(query).forEach((key) => {
    if (!excludedFilters.includes(key)) {
      delete query[key];
    }
  });

  router.replace({
    path: route.path,
    query
  });
};

const closeFilter = () => {
  appStore.toggle('filterMenu', false);
};

// Watchers
const { escape } = useMagicKeys()

if (escape) {
  watch(escape, closeFilter)
}
</script>

<template>
  <!-- <FilterMenuMobile
    :color-options="colorOptions"
    :size-options="sizeOptions"
    :product-type-options="productTypeOptions"
    :sort-options="sortOptions"
    :active-filter-count="activeFilterCount"
    @close-filter="closeFilter"
    @set-sort-option="setSortOption"
    @set-filter-option="setFilterOption"
    @clear-all-filters="clearAllFilters"
  /> -->
  <FilterMenuDesktop
    :color-options="colorOptions"
    :size-options="sizeOptions"
    :product-type-options="productTypeOptions"
    :sort-options="sortOptions"
    :active-filter-count="activeFilterCount"
    @close-filter="closeFilter"
    @set-sort-option="setSortOption"
    @set-filter-option="setFilterOption"
    @clear-all-filters="clearAllFilters"
  />
</template>
