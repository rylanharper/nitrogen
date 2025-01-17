<script setup lang="ts">
import type { SearchProductsQueryVariables, ProductFragment } from '@@/types/shopify';

// Route data
const route = useRoute();
const router = useRouter();
const searchQuery = computed(() => route.query.q as string);

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// Helpers
const { getSearchSortValues, getFilterValues } = useShopifyHelpers();

// Sort params/values
const sortParam = computed(() => route.query.sort as string | null);
const sortValues = computed(() => getSearchSortValues(sortParam.value));

// Filter params/values
const filterParam = computed(() => route.query);
const filterValues = computed(() => getFilterValues(filterParam.value));

// Get the active filter options from URL
const activeFilterOptions = computed(() => {
  const filters: { name: string; value: string }[] = [];
  const allowedParams = ['sort', 'color', 'size', 'productType'];

  Object.entries(route.query).forEach(([name, value]) => {
    if (!value || !allowedParams.includes(name)) return;

    if (name === 'sort') {
      filters.push({ name, value: value as string });
    } else {
      (value as string).split(',').forEach((filterValue) => {
        filters.push({ name, value: filterValue });
      });
    }
  });

  return filters;
});

// State
const limit = 12;
const itemsPerPage = ref(Number(route.query.limit) || limit);

// Fetch Shopify data
const shopify = useShopify();

const searchVars = computed<SearchProductsQueryVariables>(() => ({
  searchTerm: searchQuery.value,
  filters: filterValues.value,
  first: itemsPerPage.value,
  sortKey: sortValues.value.sortKey,
  reverse: sortValues.value.reverse,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data: searchData } = await useAsyncData(
  `search-${searchQuery.value}`,
  () => shopify.search.products(searchVars.value),
  { watch: [searchVars] }
);

const searchBaseVars = computed<SearchProductsQueryVariables>(() => ({
  searchTerm: searchQuery.value,
  first: 250
}));

const { data: searchBaseData } = await useAsyncData(
  `search-base-${searchQuery.value}`,
  () => shopify.search.products(searchBaseVars.value),
  { watch: [searchBaseVars], lazy: true, deep: false }
);

// Computed data
const search = computed(() => searchData.value );
const searchBase = computed(() => searchBaseData.value );

// Get/flatten search results (if any)
const filteredProducts = computed(() =>
  search.value ? flattenConnection(search.value) as ProductFragment[] : []
);
const allProducts = computed(() =>
  searchBase.value ? flattenConnection(searchBase.value) as ProductFragment[] : []
);

// Check for more products
const hasMoreProducts = computed(() =>
  search.value?.pageInfo?.hasNextPage || false
);

// Number of products based on filters or without
const numberOfProducts = computed(() => {
  return filterValues.value.length ? filteredProducts.value.length : allProducts.value.length;
});

// Actions
const loadMoreProducts = () => {
  const productLimit = itemsPerPage.value += limit;

  router.replace({
    path: route.path,
    query: { ...route.query, limit: productLimit }
  });
};

const removeActiveFilterOption = (filterName: string, filterValue: string) => {
  const query = { ...route.query };

  if (filterName === 'sort') {
    delete query.sort;
  } else {
    const currentValues = (route.query[filterName] as string)?.split(',') || [];
    const newValues = currentValues.filter((value) => value !== filterValue);

    if (newValues.length > 0) {
      query[filterName] = newValues.join(',');
    } else {
      delete query[filterName];
    }
  }

  router.replace({
    path: route.path,
    query
  });
};

const toggleFilter = () => {
  appStore.toggleFilterMenu();
};

// SEO
const pageTitle = computed(() =>
  searchQuery.value
    ? `Search: ${numberOfProducts.value} results found for "${searchQuery.value}"`
    : 'Search'
);

useHead(() => ({
  title: pageTitle.value
}));
</script>

<template>
  <section v-if="search" class="flex flex-col px-6 mb-20">
    <FilterMenu
      v-if="allProducts"
      :products="allProducts"
    />
    <div class="grid my-6 grid-cols-[1fr_max-content_1fr]">
      <div class="col-start-1 flex justify-start items-center">
        <h1 class="normal-case text-xl tracking-tight leading-none">
          Results for "{{ searchQuery }}" ({{ numberOfProducts }})
        </h1>
      </div>
      <div class="hidden lg:flex">
        <div v-if="activeFilterOptions.length" class="flex flex-wrap gap-2">
          <div v-for="option in activeFilterOptions" :key="option.value">
            <button
              class="flex items-center justify-center p-2 px-4 gap-2.5 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-red-50 hover:text-red-600 hover:border-red-500"
              @click="removeActiveFilterOption(option.name, option.value)"
            >
              {{ option.value }}
              <Icon name="ph:x" class="h-4 w-4 shrink-0" />
            </button>
          </div>
        </div>
        <span v-else class="invisible" />
      </div>
      <div class="col-start-3 flex justify-end items-center">
        <button
          class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
          @click="toggleFilter"
        >
          Filter & Sort
        </button>
      </div>
    </div>
    <div
      v-if="filteredProducts && filteredProducts.length"
      class="grid grid-cols-2 auto-rows-fr gap-x-6 gap-y-8 w-full mb-8 lg:grid-cols-4 lg:gap-y-12"
    >
      <div v-for="product in filteredProducts" :key="product.id">
        <ProductCard :product="product" />
      </div>
    </div>
    <div v-if="hasMoreProducts" class="flex justify-center">
      <button
        class="p-2 px-4 text-normalize bg-transparent border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-100 disabled:opacity-50"
        @click="loadMoreProducts"
      >
        See More Products
      </button>
    </div>
  </section>
  <section v-else class="flex items-center gap-2 p-6">
    <Icon name="ph:warning-circle" class="h-5 w-5 shrink-0" />
    <p class="normal-case">No search data found.</p>
  </section>
</template>
