<script setup lang="ts">
import type { CollectionQueryVariables, Product } from '@@/types/shopify';

// Route data
const route = useRoute();
const router = useRouter();
const handle = computed(() => route.params.handle as string);

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// Helpers
const { getCollectionSortValuesFromUrl, getFilterValuesFromUrl } = useCollectionHelpers();

// Sort query
const sortParam = computed(() => route.query.sort as string | null);
const sortValues = computed(() => getCollectionSortValuesFromUrl(sortParam.value));

// Filter query
const filterParam = computed(() => route.query);
const filters = computed(() => getFilterValuesFromUrl(filterParam.value));

// Active options
const activeFilterOptions = computed(() => {
  const filters: { name: string; value: string }[] = [];

  Object.entries(route.query).forEach(([name, value]) => {
    if (!value || name === 'q') return;

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

// Remove active option
function removeActiveFilterOption(filterName: string, filterValue: string) {
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
}

// Shopify
const shopify = useShopify();

// Fetch data
const collectionVars = computed<CollectionQueryVariables>(() => ({
  handle: handle.value,
  filters: filters.value,
  sortKey: sortValues.value.sortKey,
  reverse: sortValues.value.reverse,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data: collectionData } = await useAsyncData('collection-data', () =>
  shopify.collection.get(collectionVars.value), {
    watch: [collectionVars]
  }
);

const filterVars = computed<CollectionQueryVariables>(() => ({
  handle: handle.value
}));

const { data: filterData } = await useAsyncData('filter-data', () =>
  shopify.collection.get(filterVars.value), {
    watch: [filterVars]
  }
);

// Computed data
const collection = computed(() => collectionData?.value);
const filterOptions = computed(() => flattenNodeConnection(filterData.value?.products) as Product[]);
const products = computed(() => flattenNodeConnection(collection.value?.products) as Product[]);

// Toggles
function toggleFilterMenu() {
  appStore.toggleFilterMenu();
}

// SEO
useHead({
  title: collection.value?.title
});
</script>

<template>
  <section v-if="collection" class="relative flex flex-col px-6">
    <div class="grid my-6 grid-cols-[1fr_max-content_1fr]">
      <div class="col-start-1 flex justify-start items-center">
        <h1 class="normal-case text-xl tracking-tight leading-none">
          {{ collection.title }} ({{ products.length }})
        </h1>
      </div>
      <div class="hidden lg:flex">
        <div v-if="activeFilterOptions.length" class="flex flex-wrap gap-2">
          <div v-for="option in activeFilterOptions" :key="`${option.name}-${option.value}`">
            <button
              @click="removeActiveFilterOption(option.name, option.value)"
              class="flex items-center justify-center p-2 px-4 gap-2.5 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-red-50 hover:text-red-600 hover:border-red-500"
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
          @click="toggleFilterMenu"
          class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          Filter & Sort
        </button>
      </div>
    </div>
    <div
      v-if="products.length"
      class="grid grid-cols-2 auto-rows-fr gap-x-6 gap-y-8 w-full mb-8 lg:grid-cols-4 lg:gap-y-12"
    >
      <div v-for="product in products" :key="product.id">
        <product-card :product="product" />
      </div>
    </div>
    <div v-else class="flex items-center gap-2">
      <Icon name="ph:seal-warning" class="h-5 w-5 shrink-0" />
      <p class="normal-case">There are no matching products.</p>
    </div>
  </section>
  <section v-else class="flex items-center justify-center inset-0 size-full">
    <p class="normal-case">No collection data found.</p>
  </section>
  <filter-menu v-if="filterOptions" :products="filterOptions" />
</template>
