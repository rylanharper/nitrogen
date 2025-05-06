<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

import { useMagicKeys } from '@vueuse/core';
import { sortSizeOptions, isSizeOption } from '@/helpers/shopify';
import { flattenConnection } from '@/utils/graphql';

// Props
const props = defineProps<{
  products: ProductFragment[];
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
  const colorMap = new Map();

  props.products.forEach((product) => {
    const references = flattenConnection(product.filter_color?.references)

    references?.forEach((reference) => {
      if (!('fields' in reference)) return;

      const name = reference.fields.find(({ key }) => key === 'name')?.value;
      const hex = reference.fields.find(({ key }) => key === 'hexcode')?.value;
      const image = reference.fields.find(({ key }) => key === 'image')?.value || null;

      if (name && hex) colorMap.set(name, { name, hex, image });
    });
  });

  return [...colorMap.values()].sort((a, b) => a.name.localeCompare(b.name));
});

const sizeOptions = computed(() => {
  const allSizes = new Set<string>();

  props.products.forEach((product) => {
    product.options?.forEach((option) => {
      if (isSizeOption(option.name)) {
        option.optionValues?.forEach((value) => {
          if (value?.name) allSizes.add(value.name);
        });
      }
    });
  });

  return sortSizeOptions([...allSizes]);
});

const productTypeOptions = computed(() => {
  const allProductTypes = new Set<string>();

  props.products.forEach((product) => {
    if (product?.productType) {
      allProductTypes.add(product.productType);
    }
  });

  return [...allProductTypes].sort();
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
  appStore.toggle('filterMenu', false);
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
