<script setup lang="ts">
import type { CollectionQueryVariables, ProductFragment } from '@@/types/shopify';
import { useAppStore } from '@/stores/app';
import { useShopStore } from '@/stores/shop';
import { useShopify } from '@/composables/use-shopify';
import { useCollectionHelpers } from '@/composables/use-collection-helpers';
import { flattenNodeConnection } from '@/utils/flatten-nodes';

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// Route
const route = useRoute();
const router = useRouter();
const handle = route.params.handle as string;

// Composables
const { getCollectionSortValuesFromUrl, getFilterValuesFromUrl, filterProductsByAvailability } = useCollectionHelpers();
const shopify = useShopify();

// Sort query
const sortParam = computed(() => route.query.sort as string | null);
const sortValues = computed(() => getCollectionSortValuesFromUrl(sortParam.value));

// Filter query
const filterParam = computed(() => route.query);
const filters = computed(() => getFilterValuesFromUrl(filterParam.value));

// Active filter options
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

// Remove active filter option
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

// Fetch data
const variables = computed<CollectionQueryVariables>(() => ({
  handle,
  filters: filters.value,
  sortKey: sortValues.value.sortKey,
  reverse: sortValues.value.reverse,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data, error, refresh } = await useAsyncData('collection', () =>
  shopify.collection.get(variables.value), {
    watch: [variables]
  }
);

if (error.value) {
  console.error('Error fetching collection data', error.value);
}

// Computed data
const collection = computed(() => data?.value);
const products = computed(() => flattenNodeConnection(collection.value?.products));
const availableProducts = computed(() => filterProductsByAvailability(products.value, filters.value));

// Save the initial product values via `useState`
// This helps the filter-menu retain the correct filter and sort options across navigation and query changes
const initialProducts = useState<ProductFragment[] | null>('initialProducts', () => shallowRef(null))

// Watchers
watch(
  products,
  () => {
    if (!initialProducts.value) {
      initialProducts.value = products.value;
    }
  },
  { immediate: true }
);

watch(
  () => handle,
  () => {
    clearNuxtState('initialProducts');
    refresh();
  }
);

// Toggle filter menu
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
    <div class="grid grid-cols-[1fr_max-content_1fr] my-6">
      <div class="flex grid-flow-col justify-start items-center">
        <h1 class="normal-case text-xl tracking-tight leading-none">
          {{ collection.title }} ({{ availableProducts.length }})
        </h1>
      </div>
      <div v-if="activeFilterOptions.length" class="hidden flex-wrap gap-2 lg:flex">
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
      <div v-else class="invisible">
        <span></span>
      </div>
      <div class="flex grid-flow-col justify-end items-center">
        <button
          @click="toggleFilterMenu"
          class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          Filter & Sort
        </button>
      </div>
    </div>
    <div
      v-if="availableProducts.length"
      class="grid grid-cols-2 auto-rows-fr gap-x-6 gap-y-8 w-full mb-8 lg:grid-cols-4 lg:gap-y-12"
    >
      <div v-for="product in availableProducts" :key="product.id">
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
  <filter-menu v-if="initialProducts" :products="initialProducts" />
</template>
