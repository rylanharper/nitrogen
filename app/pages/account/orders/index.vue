<script setup lang="ts">
import type { CustomerQueryVariables } from '@@/types/shopify';

// Stores
const authStore = useAuthStore();
const shopStore = useShopStore();

// Fetch Shopify data
const shopify = useShopify();

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

// Flatten connections
const orders = computed(() => flattenConnection(customer.value?.orders));

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
    class="relative flex flex-col lg:col-span-2 2xl:col-span-1 mb-20"
  >
    <div class="flex flex-col gap-6 lg:mt-6 lg:px-8">
      <h2 class="px-6 text-xl tracking-tight leading-none lg:p-0">
        Orders ({{ orders?.length }})
      </h2>
      <div v-if="orders && orders?.length">
        <AccountOrders :orders="orders" />
      </div>
      <div v-else class="flex items-center gap-2 px-6 lg:p-0">
        <Icon name="ph:warning-circle" class="size-5 shrink-0" />
        <p>You haven&apos;t placed any orders yet.</p>
      </div>
    </div>
  </section>
  <section v-else class="flex items-center self-start p-6 gap-2">
    <Icon name="ph:warning-circle" class="size-5 shrink-0" />
    <p>No customer data found.</p>
  </section>
</template>
