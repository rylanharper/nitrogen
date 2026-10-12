<script setup lang="ts">
import type { OrderSummaryFragment } from '#shopify/customer-account'

// Props
const props = defineProps<{
  orders: OrderSummaryFragment[]
}>()
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="uppercase">
      Orders
    </h2>
    <div
      v-if="props.orders.length"
      class="flex flex-col divide-y divide-zinc-200 border-y border-zinc-200"
    >
      <NuxtLink
        v-for="order in props.orders"
        :key="order.id"
        :to="order.statusPageUrl"
        external
        target="_blank"
        class="grid grid-cols-2 gap-2 py-3 transition duration-200 hover:bg-zinc-50 sm:grid-cols-4"
      >
        <span>{{ order.name }}</span>
        <span class="text-zinc-500">
          {{ formatDateByLocale('en-US', order.processedAt) }}
        </span>
        <span class="text-zinc-500 uppercase">
          {{ order.fulfillmentStatus }}
        </span>
        <span class="justify-self-end">
          {{ formatCurrency(order.totalPrice.amount, order.totalPrice.currencyCode) }}
        </span>
      </NuxtLink>
    </div>
    <div
      v-else
      class="flex items-center gap-2.5"
    >
      <Icon
        name="ph:warning-circle"
        class="inline-block shrink-0 size-5!"
      />
      <p>No orders found.</p>
    </div>
  </section>
</template>
