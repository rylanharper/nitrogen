<script setup lang="ts">
import { useCartStore } from '@/stores/cart';

// Stores
const cartStore = useCartStore();

// Computed
const cartSubtotal = computed(() => cartStore.subtotalAmount);
const checkoutUrl = computed(() => cartStore.checkoutUrl);
</script>

<template>
  <div class="flex flex-col gap-3 py-4 bg-white border-t border-zinc-300">
    <div class="flex justify-between">
      <span>Subtotal:</span>
      <PriceDisplay :price="cartSubtotal" />
    </div>
    <NuxtLink
      v-if="checkoutUrl"
      :to="checkoutUrl"
      class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
    >
      Checkout
    </NuxtLink>
    <p class="text-sm text-center">Taxes &amp; shipping calculated at checkout</p>
  </div>
</template>
