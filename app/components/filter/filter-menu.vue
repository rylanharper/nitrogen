<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  products: ProductFragment[];
}>();

// Route data
const route = useRoute();
const router = useRouter();

// Stores
const appStore = useAppStore();

// Helpers
const { sortSizeOptions } = useShopifyHelpers();

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

// Get active filter count from URL
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
  const allColors = new Set(
    props.products
      .flatMap((product) => product.options)
      .filter((option) => isColorOption(option.name))
      .flatMap((option) => option.optionValues)
      .map((value) => value.name)
  );

  return Array.from(allColors).sort();
});

const sizeOptions = computed(() => {
  const allSizes = new Set(
    props.products
      .flatMap((product) => product.options)
      .filter((option) => isSizeOption(option.name))
      .flatMap((option) => option.optionValues)
      .map((value) => value.name)
  );

  return sortSizeOptions(Array.from(allSizes));
});

const productTypeOptions = computed(() => {
  const allProductTypes = new Set(
    props.products.map((product) => product.productType)
  );

  return Array.from(allProductTypes).sort();
});

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
  appStore.filterMenuOpen = false;
};

// Watchers
const { escape } = useMagicKeys();

if (escape) {
  watch(escape, () => {
    closeFilter();
  });
}
</script>

<template>
  <FilterMenuMobile
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
