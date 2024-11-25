<script setup lang="ts">
import type { CollectionQueryVariables, ProductFragment } from '@@/types/shopify';

// Route data
const route = useRoute();
const router = useRouter();
const handle = computed(() => route.params.handle as string);

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// Helpers
const { getCollectionSortValuesFromUrl, getFilterValuesFromUrl } = useCollectionHelpers();

// Sort params/values
const sortParam = computed(() => route.query.sort as string | null);
const sortValues = computed(() => getCollectionSortValuesFromUrl(sortParam.value));

// Filter params/values
const filterParam = computed(() => route.query);
const filterValues = computed(() => getFilterValuesFromUrl(filterParam.value));

// Get active filters from URL
const activeFilterOptions = computed(() => {
  const filters: { name: string; value: string }[] = [];
  const excludedParams = ['q', 'limit'];

  Object.entries(route.query).forEach(([name, value]) => {
    if (!value || excludedParams.includes(name)) return;

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

// Shopify
const shopify = useShopify();

// Fetch data
const collectionVars = computed<CollectionQueryVariables>(() => ({
  handle: handle.value,
  first: itemsPerPage.value,
  filters: filterValues.value,
  sortKey: sortValues.value.sortKey,
  reverse: sortValues.value.reverse,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data: collectionData } = await useAsyncData(
  `collection-${handle.value}`,
  () => shopify.collection.get(collectionVars.value),
  { watch: [collectionVars] }
);

const filterVars = computed<CollectionQueryVariables>(() => ({
  handle: handle.value,
  first: 250
}));

const { data: filterData } = await useAsyncData(
  `collection-filter-${handle.value}`,
  () => shopify.collection.get(filterVars.value),
  { watch: [filterVars], lazy: true, deep: false }
);

// Computed data
const collection = computed(() => collectionData?.value);
const filterProducts = computed(() => flattenConnection(filterData.value?.products) as ProductFragment[]);
const products = computed(() => flattenConnection(collection.value?.products) as ProductFragment[]);

// Check for products
const hasMoreProducts = computed(() =>
  collection.value?.products?.pageInfo?.hasNextPage || false
);

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
useHead({
  title: collection.value?.title
});
</script>

<template>
  <section v-if="collection" class="flex flex-col px-6 mb-20">
    <FilterMenu
      v-if="filterProducts"
      :products="filterProducts"
    />
    <div class="grid my-6 grid-cols-[1fr_max-content_1fr]">
      <div class="col-start-1 flex justify-start items-center">
        <h1 class="normal-case text-xl tracking-tight leading-none">
          {{ collection.title }} ({{ filterProducts.length }})
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
      v-if="products && products.length"
      class="grid grid-cols-2 auto-rows-fr gap-x-6 gap-y-8 w-full mb-8 lg:grid-cols-4 lg:gap-y-12"
    >
      <div v-for="product in products" :key="product.id">
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
    <p class="normal-case">No collection data found.</p>
  </section>
</template>
