<script setup lang="ts">
import type { CartLineFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  line: CartLineFragment;
}>();

// Stores
const cartStore = useCartStore();

// Computed
const merchandise = computed(() => props.line.merchandise);
const variantId = computed(() => formatVariantId(props.line.merchandise.id));

// Filters out default names/value from selected options
// Appears only when products with default options are added to the cart
const selectedOptions = computed(() => {
  return merchandise.value.selectedOptions.filter(
    (option) => option.name !== 'Title' && option.value !== 'Default Title'
  );
});

// Actions
const removeLineFromCart = async (lineId: string) => {
  await cartStore.removeFromCart([lineId]);
};

const updateLineQuantity = async (line: CartLineFragment, newQuantity: number) => {
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
};
</script>

<template>
  <div class="flex items-center gap-6 pb-4 my-4 border-b border-zinc-300">
    <NuxtLink
      :to="`/products/${merchandise.product.handle}?variant=${variantId}`"
      class="aspect-square size-28 shrink-0 border border-transparent transition duration-200 hover:border-zinc-300"
    >
      <ShopifyImage
        :image="merchandise.product.featuredImage"
        :alt="merchandise.product.title"
      />
    </NuxtLink>
    <div class="flex flex-col justify-between flex-1 gap-6 min-h-[100px]">
      <div class="flex justify-between">
        <div class="uppercase">
          <h3 class="mb-1.5">{{ merchandise.product.title }}</h3>
          <p v-for="option in selectedOptions" :key="option.name">
            {{ option.name }}: {{ option.value }}
          </p>
        </div>
        <div>
          <PriceDisplay :price="line.cost.totalAmount" />
        </div>
      </div>
      <div class="flex justify-between">
        <div class="flex items-center gap-4">
          <button
            class="flex items-center p-2 bg-transparent border border-zinc-300 rounded-full transition duration-200 hover:lg:border-black"
            @click="updateLineQuantity(line, line.quantity - 1)"
          >
            <Icon name="ph:minus" class="h-3 w-3 shrink-0" />
          </button>
          <span>{{ line.quantity }}</span>
          <button
            class="flex items-center p-2 bg-transparent border border-zinc-300 rounded-full transition duration-200 hover:lg:border-black"
            @click="updateLineQuantity(line, line.quantity + 1)"
          >
            <Icon name="ph:plus" class="h-3 w-3 shrink-0" />
          </button>
        </div>
        <button
          class="max-w-fit underline decoration-dotted decoration-1 underline-offset-[3px] hover:text-gray-500"
          @click="removeLineFromCart(line.id)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
