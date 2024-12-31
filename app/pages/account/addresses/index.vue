<script setup lang="ts">
import type { CustomerQueryVariables, MailingAddressFragment } from '@@/types/shopify';

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

const customer = computed(() => customerData.value);
const defaultAddress = computed(() => customerData.value?.defaultAddress as MailingAddressFragment);

// Computed data
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
      <h2 class="normal-case text-xl tracking-tight leading-none lg:p-0">
        Addresses
      </h2>
      <div v-if="addresses && addresses?.length">
        <AccountAddress
          :default-address="defaultAddress"
          :addresses="addresses"
        />
      </div>
      <div v-else class="flex flex-col px-6 normal-case lg:p-0">
        <p class="normal-case">You have no saved shipping address.</p>
        <NuxtLink
          :to="{ name: 'account-addresses-add' }"
          class="max-w-fit normal-case underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 ease-in-out hover:text-zinc-500"
        >
          Add Your Address
        </NuxtLink>
      </div>
    </div>
  </section>
  <section v-else class="flex items-center self-start p-6 gap-2">
    <Icon name="ph:warning-circle" class="h-5 w-5 shrink-0" />
    <p class="normal-case">No customer data found.</p>
  </section>
</template>
