<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';
import { useAppStore } from '@/stores/app';
import { useCollectionHelpers } from '@/composables/use-collection-helpers';
import { useMagicKeys } from '@vueuse/core';

// Props
const props = defineProps<{
  products: ProductFragment[];
}>();

// Stores
const appStore = useAppStore();

// Route and Router
const route = useRoute();
const router = useRouter();

// Composables
const helpers = useCollectionHelpers();

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

// Set sort option
function setSortOption(sortValue: string | null) {
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
}

// Set filter option
function setFilterOption(filterName: string, filterValue: string) {
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
}

// Active filter count
const activeFilterCount = computed(() => {
  let count = 0;

  Object.entries(route.query).forEach(([name, value]) => {
    if (!value || name === 'q') return;

    if (name === 'sort') {
      count += 1;
    } else {
      count += (value as string).split(',').length;
    }
  });

  return count;
});

// Color Options
const colorOptions = computed(() => {
  const colorOptionNames = ['Color', 'Colour'];
  const allColors = new Set(
    props.products
      .flatMap((product) => product.options)
      .filter((option) => colorOptionNames.includes(option.name))
      .flatMap((option) => option.optionValues)
      .map((value) => value.name)
  );

  return Array.from(allColors).sort();
});

// Size options
const sizeOptions = computed(() => {
  const sizeOptionNames = ['Size', 'Length'];
  const allSizes = new Set(
    props.products
      .flatMap((product) => product.options)
      .filter((option) => sizeOptionNames.includes(option.name))
      .flatMap((option) => option.optionValues)
      .map((value) => value.name)
  );

  return helpers.sortLetterAndNumberSizes(Array.from(allSizes));
});

// ProductType options
const productTypeOptions = computed(() => {
  const allProductTypes = new Set(
    props.products.map((product) => product.productType)
  );

  return Array.from(allProductTypes).sort();
});

// Clear all filters, except search query
function clearAllFilters() {
  const query = { ...route.query };

  Object.keys(query).forEach((key) => {
    if (key !== 'q') {
      delete query[key];
    }
  });

  router.replace({
    path: route.path,
    query
  });
}

// Close filter menu
function closeFilter() {
  appStore.filterMenuOpen = false;
}

// Watchers
const { escape } = useMagicKeys();

if (escape) {
  watch(escape, () => {
    if (appStore.filterMenuOpen) {
      closeFilter();
    }
  });
}
</script>

<template>
  <filter-menu-mobile
    :sizeOptions="sizeOptions"
    :colorOptions="colorOptions"
    :productTypeOptions="productTypeOptions"
    :sortOptions="sortOptions"
    :activeFilterCount="activeFilterCount"
    @closeFilter="closeFilter"
    @setSortOption="setSortOption"
    @setFilterOption="setFilterOption"
    @clearAllFilters="clearAllFilters"
  />
  <filter-menu-desktop
    :colorOptions="colorOptions"
    :sizeOptions="sizeOptions"
    :productTypeOptions="productTypeOptions"
    :sortOptions="sortOptions"
    :activeFilterCount="activeFilterCount"
    @closeFilter="closeFilter"
    @setSortOption="setSortOption"
    @setFilterOption="setFilterOption"
    @clearAllFilters="clearAllFilters"
  />
</template>
