<script setup lang="ts">
import type { OrderFragment } from '@@/types/shopify';
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
</script>

<template>
  <div class="relative overflow-x-auto mb-5 border border-t border-b border-zinc-300 lg:border lg:rounded-lg">
    <table class="table-fixed min-w-full divide-y divide-zinc-300">
      <thead class="bg-zinc-50">
        <tr>
          <th
            v-for="header in headers"
            :key="header.label"
            class="pl-6 pr-12 py-2.5 text-start lg:w-[16.667%]"
          >
            <span class="text-sm font-normal whitespace-nowrap">{{ header.label }}</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-300">
        <tr v-for="order in orders" :key="order.id">
          <td class="pl-6 pr-12 py-3 lg:w-[16.667%]">
            <nuxt-link
              :to="order.statusUrl"
              target="_blank"
              rel="noreferrer"
              class="flex items-center gap-2 whitespace-nowrap"
            >
              {{ order.lineItems?.edges[0]?.node.title }}
              <Icon name="ph:arrow-up-right" class="h-4 w-4 shrink-0 text-zinc-400"/>
            </nuxt-link>
          </td>
          <td class="pl-6 pr-12 py-3 lg:w-[16.667%]">
            <span>{{ order.lineItems?.edges[0]?.node.quantity }}</span>
          </td>
          <td class="pl-6 pr-12 py-3 lg:w-[16.667%]">
            <span>{{ order.orderNumber }}</span>
          </td>
          <td class="pl-6 pr-12 py-3 lg:w-[16.667%]">
            <time>{{ formatDateByLocale('en-US', order.processedAt) }}</time>
          </td>
          <td class="pl-6 pr-12 py-3 lg:w-[16.667%]">
            <span
              class="px-1.5 max-w-fit text-sm border rounded-md"
              :class="
                order.fulfillmentStatus === 'FULFILLED'
                  ? 'bg-blue-50 text-blue-600 border-blue-500'
                  : 'bg-amber-50 text-amber-600 border-amber-500'
              "
            >
              {{ order.fulfillmentStatus }}
            </span>
          </td>
          <td class="pl-6 pr-12 py-3 lg:w-[16.667%]">
            <price-display class="price" :price="order.currentTotalPrice" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
