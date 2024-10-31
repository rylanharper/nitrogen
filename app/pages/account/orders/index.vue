<script setup lang="ts">
import type { CustomerQueryVariables } from '@@/types/shopify';

// Stores
const authStore = useAuthStore();
const shopStore = useShopStore();

// Shopify
const shopify = useShopify();

// Fetch data
const customerVars = computed<CustomerQueryVariables>(() => ({
  customerAccessToken: authStore.accessToken,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data: customerData } = await useAsyncData(
  'customer-data',
  () => shopify.customer.get(customerVars.value),
  { watch: [customerVars] }
);

// Computed data
const customer = computed(() => customerData.value);
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
