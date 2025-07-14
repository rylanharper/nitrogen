<script setup lang="ts">
import type { OrderFragment } from '@@/types/shopify-storefront';

import { formatDateByLocale } from '@/utils/formatters';

// Props
const props = defineProps<{
  orders: OrderFragment[];
}>();

// Headers
const headers = [
  { label: 'Item Name' },
  { label: 'Quantity' },
  { label: 'Order No.' },
  { label: 'Date' },
  { label: 'Status' },
  { label: 'Total' }
];

// Computed
const accountOrders = computed(() =>
  props.orders.map(order => ({
    ...order,
    lineItem: order.lineItems?.edges[0]?.node
  }))
);
</script>

<template>
  <div class="overflow-x-auto mb-4.5 border-t border-b border-zinc-300 lg:border lg:rounded-lg">
    <table class="table-fixed min-w-full divide-y divide-zinc-300">
      <thead class="bg-zinc-50">
        <tr>
          <th
            v-for="header in headers"
            :key="header.label"
            class="pl-6 pr-12 py-2.5 uppercase text-sm text-start whitespace-nowrap"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-300">
        <tr v-for="order in accountOrders" :key="order.id">
          <td class="pl-6 pr-12 py-3">
            <NuxtLink
              :to="order.statusUrl"
              target="_blank"
              rel="noreferrer"
              class="flex items-center gap-2 whitespace-nowrap"
            >
              {{ order.lineItem?.title }}
              <Icon name="ph:arrow-up-right" class="size-4 shrink-0 text-zinc-400"/>
            </NuxtLink>
          </td>
          <td class="pl-6 pr-12 py-3">
            <span>{{ order.lineItem?.quantity }}</span>
          </td>
          <td class="pl-6 pr-12 py-3">
            <span>{{ order.orderNumber }}</span>
          </td>
          <td class="pl-6 pr-12 py-3">
            <time>{{ formatDateByLocale('en-US', order.processedAt) }}</time>
          </td>
          <td class="pl-6 pr-12 py-3">
            <span
              class="px-2 py-0.5 max-w-fit uppercase text-sm border rounded"
              :class="
                order.fulfillmentStatus === 'FULFILLED'
                  ? 'bg-blue-50 text-blue-600 border-blue-500'
                  : 'bg-amber-50 text-amber-600 border-amber-500'
              "
            >
              {{ order.fulfillmentStatus }}
            </span>
          </td>
          <td class="pl-6 pr-12 py-3">
            <PriceDisplay :price="order.totalPrice" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
