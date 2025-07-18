<script setup lang="ts">
import type {
  CustomerQueryVariables,
  OrderFragment,
  MailingAddressFragment,
} from '@@/types/shopify-storefront'

import { flattenConnection } from '@/utils/graphql'

// Stores
const authStore = useAuthStore()
const shopStore = useShopStore()

// Shopify
const shopify = useShopify()

// Fetch Shopify data
const customerVars = computed<CustomerQueryVariables>(() => ({
  customerAccessToken: authStore.accessToken,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const { data: customerData } = await useAsyncData(
  'customer-data',
  () => shopify.customer.get(customerVars.value),
  { watch: [customerVars] },
)

// Response data
const customer = computed(() => customerData.value)

// Access data nodes
const orders = computed(() => flattenConnection(customer.value?.orders) as OrderFragment[])
const addresses = computed(() => flattenConnection(customer.value?.addresses) as MailingAddressFragment[])

// Computed data
const defaultAddress = computed(() => customer.value?.defaultAddress as MailingAddressFragment)

// SEO
useHead({
  title: 'Account',
})

// Meta
definePageMeta({
  layout: 'account',
})
</script>

<template>
  <section class="flex flex-col lg:col-span-2 2xl:col-span-1 mb-20">
    <div class="flex flex-col gap-10 lg:mt-6 lg:px-8">
      <div class="flex flex-col gap-6">
        <h2 class="px-6 text-xl tracking-tight leading-none lg:p-0">
          Recent Orders
        </h2>
        <div
          v-if="orders && orders.length"
          class="flex flex-col"
        >
          <AccountOrders :orders="orders.slice(0, 3)" />
          <div class="flex px-6 lg:px-0">
            <NuxtLink
              to="/account/orders"
              class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
            >
              <span>View All Orders</span>
            </NuxtLink>
          </div>
        </div>
        <div
          v-else
          class="flex items-center gap-2.5 px-6 lg:p-0"
        >
          <Icon
            name="ph:warning-circle"
            class="inline-block shrink-0 !size-5"
          />
          <p>You haven&apos;t placed any orders yet.</p>
        </div>
      </div>
      <div class="flex flex-col gap-6">
        <h2 class="px-6 text-xl tracking-tight leading-none lg:p-0">
          Saved Addresses
        </h2>
        <div
          v-if="addresses && defaultAddress"
          class="px-6 lg:px-0"
        >
          <AccountAddress
            :addresses="addresses"
            :default-address="defaultAddress"
          />
        </div>
        <div
          v-else
          class="flex flex-col px-6 lg:p-0"
        >
          <p>You have no saved shipping address.</p>
          <NuxtLink
            to="/account/addresses/add"
            class="max-w-fit underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 hover:text-zinc-500"
          >
            <span>Add Your Address</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
