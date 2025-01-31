<script setup lang="ts">
import type { CustomerQueryVariables, MailingAddressFragment } from '@@/types/shopify';

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
const defaultAddress = computed(() => customerData.value?.defaultAddress as MailingAddressFragment);

// Flatten connections
const orders = computed(() => flattenConnection(customer.value?.orders));
const addresses = computed(() => flattenConnection(customer.value?.addresses));

// SEO
useHead({
  title: 'Account'
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
    <div class="grid grid-cols-1 gap-10 lg:mt-6 lg:px-8">
      <div class="flex flex-col gap-6">
        <h2 class="px-6 text-xl tracking-tight leading-none lg:p-0">
          Recent Orders
        </h2>
        <div v-if="orders && orders.length" class="flex flex-col">
          <AccountOrders :orders="orders.slice(0, 3)" />
          <div class="flex px-6 lg:px-0">
            <NuxtLink
              to="/account/orders"
              class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
            >
              View All Orders
            </NuxtLink>
          </div>
        </div>
        <div v-else class="flex items-center gap-2 px-6 lg:p-0">
          <Icon name="ph:warning-circle" class="size-5 shrink-0" />
          <p>You haven&apos;t placed any orders yet.</p>
        </div>
      </div>
      <div class="flex flex-col gap-6">
        <h2 class="px-6 text-xl tracking-tight leading-none lg:p-0">
          Saved Addresses
        </h2>
        <div v-if="addresses && addresses?.length" class="px-6 lg:px-0">
          <AccountAddress
            :default-address="defaultAddress"
            :addresses="addresses"
          />
        </div>
        <div v-else class="flex flex-col px-6 lg:p-0">
          <p>You have no saved shipping address.</p>
          <NuxtLink
            to="/account/addresses/add"
            class="max-w-fit underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 ease-in-out hover:text-zinc-500"
          >
            Add Your Address
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
  <section v-else class="flex items-center self-start p-6 gap-2">
    <Icon name="ph:warning-circle" class="size-5 shrink-0" />
    <p>No customer data found.</p>
  </section>
</template>
