<script setup lang="ts">
import type { CustomerQueryVariables } from '@@/types/shopify';
import { useAuthStore } from '@/stores/auth';
import { useShopStore } from '@/stores/shop';
import { useShopify } from '@/composables/use-shopify';
import { flattenNodeConnection } from '@/utils/flatten-nodes';

// Stores
const authStore = useAuthStore();
const shopStore = useShopStore();

// Composables
const shopify = useShopify();

// Fetch data
const variables = computed<CustomerQueryVariables>(() => ({
  customerAccessToken: authStore.accessToken,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data, error } = await useAsyncData('customer', () =>
  shopify.customer.get(variables.value), {
    watch: [variables]
  }
);

if (error.value) {
  console.error('Error fetching customer data', error.value);
}

// Computed data
const customer = computed(() => data.value);
const orders = computed(() => flattenNodeConnection(customer.value?.orders));

// SEO
useHead({
  title: 'Orders'
});

// Meta
definePageMeta({
  layout: 'account'
});
</script>

<template>
  <section
    v-if="customer"
    class="relative flex flex-col lg:col-span-2 2xl:col-span-1"
  >
    <div class="flex flex-col gap-6 lg:mt-6 lg:px-8">
      <h2 class="px-6 normal-case text-xl tracking-tight leading-none lg:p-0">
        Orders
      </h2>
      <div v-if="orders?.length">
        <account-orders :orders="orders" />
      </div>
      <div v-else class="flex items-center gap-2 px-6 lg:p-0">
        <Icon name="ph:seal-warning" class="h-5 w-5 shrink-0" />
        <p class="normal-case">You haven&apos;t placed any orders yet.</p>
      </div>
    </div>
  </section>
  <section
    v-else
    class="flex flex-col items-center justify-center inset-0 size-full"
  >
    <p class="normal-case">No customer data found.</p>
  </section>
</template>
