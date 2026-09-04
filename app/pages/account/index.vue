<script setup lang="ts">
import { CUSTOMER, CUSTOMER_ORDERS } from '@@/graphql/customer-account/queries/customer'

definePageMeta({
  middleware: 'customer-account',
})

// Composables
const { logout } = useCustomerAccountSession()

// Customer query
const { data: customer, error: customerError } = await useCustomerAccountData(
  'account-customer',
  CUSTOMER,
  { transform: (data) => data.customer },
)

// Orders query
const { data: ordersData, error: ordersError } = await useCustomerAccountData(
  'account-orders',
  CUSTOMER_ORDERS,
  {
    variables: { first: 10 },
    transform: (data) => data.customer.orders,
  },
)

// Orders response data
const orders = computed(() => ordersData.value?.nodes ?? [])

// SEO
useHead({
  title: 'Account',
})
</script>

<template>
  <div
    v-if="customerError && ordersError"
    class="fixed top-(--header-height) left-0 w-full h-fit text-zinc-100 bg-line-pattern border-b border-zinc-200"
  >
    <div class="flex items-center justify-center gap-2.5 py-2">
      <Icon
        name="ph:warning-circle"
        class="inline-block shrink-0 size-5!"
      />
      <p class="uppercase">
        503: No Shopify data found.
      </p>
    </div>
  </div>

  <div
    v-else
    class="wrapper px-6 mb-20"
  >
    <!-- Header -->
    <section class="grid my-6 grid-cols-[1fr_max-content]">
      <div class="flex justify-start items-center">
        <h1 class="text-xl tracking-tight leading-none">
          {{ customer?.displayName || 'Account' }}
        </h1>
      </div>
      <div class="flex justify-end items-center">
        <button
          class="flex items-center justify-center p-2 px-4 uppercase bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
          @click="logout()"
        >
          <span>Log Out</span>
        </button>
      </div>
    </section>
    <!-- Profile -->
    <AccountProfile
      v-if="customer"
      :customer="customer"
    />
    <!-- Orders -->
    <AccountOrders :orders="orders" />
  </div>
</template>
