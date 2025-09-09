<script setup lang="ts">
import type {
  CustomerQueryVariables,
  OrderFragment,
} from '@@/types/shopify-storefront'

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

// SEO
useHead({
  title: 'Orders',
})

// Meta
definePageMeta({
  layout: 'account',
})
</script>

<template>
  <section class="flex flex-col lg:col-span-2 2xl:col-span-1 mb-20">
    <div class="flex flex-col gap-6 lg:mt-6 lg:px-8">
      <h2 class="px-6 text-xl tracking-tight leading-none lg:p-0">
        Orders ({{ orders?.length }})
      </h2>
      <div v-if="orders && orders?.length">
        <AccountOrders :orders="orders" />
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
  </section>
</template>
