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
const addresses = computed(() => flattenNodeConnection(customer.value?.addresses));
const defaultAddress = computed(() => customer.value?.defaultAddress);

// SEO
useHead({
  title: 'Addresses'
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
    <div class="px-6 flex flex-col gap-6 lg:mt-6 lg:px-8">
      <h2 class="normal-case text-xl tracking-tight leading-none lg:p-0">
        Addresses
      </h2>
      <div v-if="addresses?.length">
        <account-address
          :defaultAddress="defaultAddress"
          :addresses="addresses"
        />
      </div>
      <div v-else class="flex flex-col px-6 normal-case lg:p-0">
        <p class="normal-case">You have no saved shipping address.</p>
        <nuxt-link
          :to="{ name: 'account-addresses-add' }"
          class="max-w-fit normal-case underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 ease-in-out hover:text-zinc-500"
        >
          Add Your Address
        </nuxt-link>
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
