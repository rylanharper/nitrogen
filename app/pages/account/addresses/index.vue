<script setup lang="ts">
import type {
  CustomerQueryVariables,
  MailingAddressFragment,
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
const addresses = computed(() => flattenConnection(customer.value?.addresses) as MailingAddressFragment[])

// Computed data
const defaultAddress = computed(() => customer.value?.defaultAddress as MailingAddressFragment)

// SEO
useHead({
  title: 'Addresses',
})

// Meta
definePageMeta({
  layout: 'account',
})
</script>

<template>
  <section class="flex flex-col lg:col-span-2 2xl:col-span-1 mb-20">
    <div class="px-6 flex flex-col gap-6 lg:mt-6 lg:px-8">
      <h2 class="text-xl tracking-tight leading-none lg:p-0">
        Addresses
      </h2>
      <div v-if="addresses && defaultAddress">
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
          :to="{ name: 'account-addresses-add' }"
          class="max-w-fit underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 hover:text-zinc-500"
        >
          <span>Add Your Address</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
