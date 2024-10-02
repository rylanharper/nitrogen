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
const addresses = computed(() => flattenNodeConnection(customer.value?.addresses));
const defaultAddress = computed(() => customer.value?.defaultAddress);

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
    class="relative flex flex-col lg:col-span-2 2xl:col-span-1"
  >
    <div class="flex flex-col gap-10 lg:mt-6 lg:px-8">
      <div class="flex flex-col gap-6">
        <h2 class="px-6 normal-case text-xl tracking-tight leading-none lg:p-0">
          Recent Orders
        </h2>
        <div v-if="orders.length">
          <account-orders :orders="orders.slice(0, 3)" />
          <div class="flex px-6 lg:px-0">
            <nuxt-link
              to="/account/orders"
              class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
            >
              View All Orders
            </nuxt-link>
          </div>
        </div>
        <div v-else class="flex items-center gap-2 px-6 lg:p-0">
          <Icon name="ph:seal-warning" class="h-5 w-5 shrink-0" />
          <p class="normal-case">You haven&apos;t placed any orders yet.</p>
        </div>
      </div>
      <div class="flex flex-col gap-6">
        <h2 class="px-6 normal-case text-xl tracking-tight leading-none lg:p-0">
          Saved Addresses
        </h2>
        <div v-if="addresses?.length" class="px-6 lg:px-0">
          <account-address
            :defaultAddress="defaultAddress"
            :addresses="addresses"
          />
        </div>
        <div v-else class="flex flex-col px-6 normal-case lg:p-0">
          <p class="normal-case">You have no saved shipping address.</p>
          <nuxt-link
            to="/account/addresses/add"
            class="max-w-fit normal-case underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 ease-in-out hover:text-zinc-500"
          >
            Add Your Address
          </nuxt-link>
        </div>
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
