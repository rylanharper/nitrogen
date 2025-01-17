<script setup lang="ts">
import type { ProductVariantFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  currentVariant: ProductVariantFragment | undefined;
  variants: ProductVariantFragment[];
}>();

// Stores
const appStore = useAppStore();
const cartStore = useCartStore();

// State
const isLoading = ref(false);

// Actions
const openModal = () => {
  appStore.toggleBackInStockModal(true);
};

const openDrawer = () => {
  appStore.toggleCartDrawer(true);
};

const addToCart = async () => {
  if (!props.currentVariant) return
  isLoading.value = true;

  await cartStore.addToCart([
    {
      merchandiseId: props.currentVariant?.id,
      quantity: 1
    }
  ]);

  openDrawer();
  isLoading.value = false;
};
</script>

<template>
  <div class="flex flex-col">
    <button
      v-if="props.currentVariant?.availableForSale"
      :disabled="isLoading"
      class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200 disabled:opacity-60"
      @click="addToCart"
    >
      {{ isLoading ? 'Adding...' : 'Add to Cart' }}
    </button>
    <button
      v-else-if="!props.currentVariant && props.variants.length > 1"
      class="flex items-center justify-center p-2 text-normalize bg-line-pattern border border-zinc-300 rounded-md cursor-default"
    >
      Select Size
    </button>
    <button
      v-else-if="!props.currentVariant?.availableForSale"
      class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
      @click="openModal"
    >
      Notify Me
    </button>
  </div>
</template>
