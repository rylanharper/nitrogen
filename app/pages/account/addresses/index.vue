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
const addresses = computed(() => flattenConnection(customer.value?.addresses));

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
    class="relative flex flex-col lg:col-span-2 2xl:col-span-1 mb-20"
  >
    <div class="px-6 flex flex-col gap-6 lg:mt-6 lg:px-8">
      <h2 class="text-xl tracking-tight leading-none lg:p-0">
        Addresses
      </h2>
      <div v-if="addresses && addresses?.length">
        <AccountAddress
          :default-address="defaultAddress"
          :addresses="addresses"
        />
      </div>
      <div v-else class="flex flex-col px-6 lg:p-0">
        <p>You have no saved shipping address.</p>
        <NuxtLink
          :to="{ name: 'account-addresses-add' }"
          class="max-w-fit underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 ease-in-out hover:text-zinc-500"
        >
          Add Your Address
        </NuxtLink>
      </div>
    </div>
  </section>
  <section v-else class="flex items-center self-start p-6 gap-2">
    <Icon name="ph:warning-circle" class="size-5 shrink-0" />
    <p>No customer data found.</p>
  </section>
</template>
