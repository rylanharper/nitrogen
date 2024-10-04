<script setup lang="ts">
import type { CartLineFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  line: CartLineFragment;
}>();

// Stores
const cartStore = useCartStore();

// Update line quantity
async function updateLineQuantity(line: CartLineFragment, newQuantity: number) {
  if (newQuantity <= 0) {
    await removeLineFromCart(line.id);
  } else {
    const quantityAvailable = Math.min(newQuantity, 10);

    await cartStore.updateCart([
      {
        id: line.id,
        quantity: quantityAvailable
      }
    ]);
  }
}

// Remove line
async function removeLineFromCart(lineId: string) {
  await cartStore.removeFromCart([lineId]);
}
</script>

<template>
  <div class="flex items-center gap-6 pb-4 my-4 border-b border-zinc-300">
    <nuxt-link
      :to="`/products/${line.merchandise.product.handle}`"
      class="w-28 shrink-0 border border-transparent transition duration-200 ease-in-out hover:border-zinc-300"
    >
      <shopify-image
        :image="line.merchandise.product.featuredImage"
        :alt="line.merchandise.product.title"
      />
    </nuxt-link>
    <div class="flex flex-col justify-between flex-1 gap-6 h-full">
      <div class="flex justify-between">
        <div>
          <h3 class="mb-1.5">{{ line.merchandise.product.title }}</h3>
          <p v-for="option in line.merchandise.selectedOptions" :key="option.name">
            {{ option.name }}: {{ option.value }}
          </p>
        </div>
        <div>
          <price-display :price="line.cost.totalAmount" />
        </div>
      </div>
      <div class="flex justify-between">
        <div class="flex items-center">
          <button
            @click="updateLineQuantity(line, line.quantity - 1)"
            class="flex items-center p-2 bg-transparent border border-zinc-300 rounded-full transition duration-200 ease-in-out hover:lg:border-black"
          >
            <Icon name="ph:minus" class="h-3 w-3 shrink-0" />
          </button>
          <span class="mx-4">
            {{ line.quantity }}
          </span>
          <button
            @click="updateLineQuantity(line, line.quantity + 1)"
            class="flex items-center p-2 bg-transparent border border-zinc-300 rounded-full transition duration-200 ease-in-out hover:lg:border-black"
          >
            <Icon name="ph:plus" class="h-3 w-3 shrink-0" />
          </button>
        </div>
        <button
          @click="removeLineFromCart(line.id)"
          class="text-sm text-normalize"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
