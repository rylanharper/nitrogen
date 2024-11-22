<script setup lang="ts">
import type { ProductFragment, ProductVariantFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
  matchingColors: ProductFragment[];
}>();

// Route data
const route = useRoute();
const router = useRouter();
const variantId = computed(() => route.query.variant as string);

// Stores
const appStore = useAppStore();
const cartStore = useCartStore();

// State
const selectedSize = ref('');
const currentVariant = ref<ProductVariantFragment | undefined>(undefined);
const isLoading = ref(false);

// Computed
const variants = computed(() => flattenConnection(props.product.variants));

// Add-to-cart button text
const addToCartText = computed(() => {
  if (variants.value.length === 1) {
    return currentVariant.value?.availableForSale ? 'Add to Cart' : 'Sold Out';
  }
  if (!selectedSize.value) return 'Select Size';
  if (currentVariant.value?.availableForSale) return 'Add to Cart';

  return 'Sold Out';
});

// Attach current variant ID to URL
const setVariantId = (variant: ProductVariantFragment | undefined) => {
  const query = { ...route.query };

  if (variant) {
    query.variant = formatVariantId(variant.id);
  } else {
    delete query.variant;
  }

  router.replace({ query });
};

// Actions
const selectSize = (size: string) => {
  selectedSize.value = size;
};

const openDrawer = () => {
  appStore.cartDrawerOpen = true;
};

const addToCart = async () => {
  if (!currentVariant.value) return;
  isLoading.value = true;

  try {
    await cartStore.addToCart([
      {
        merchandiseId: currentVariant.value.id,
        quantity: 1
      }
    ]);

    openDrawer();
  } catch (error) {
    console.error('Failed to add item to cart:', error);
  } finally {
    isLoading.value = false;
  }
};

// Constants
const sizeOptionNames = ['Size', 'Length'];

// Watchers
const getInitialVariant = () => {
  if (variants.value.length === 1) return variants.value[0];
  if (variantId.value) {
    return variants.value.find((variant) => formatVariantId(variant.id) === variantId.value);
  }

  return undefined;
};

const setInitialVariant = () => {
  const initialVariant = getInitialVariant();

  if (initialVariant) {
    currentVariant.value = initialVariant;

    const sizeOption = initialVariant.selectedOptions.find((option) =>
      sizeOptionNames.includes(option.name)
    );

    if (sizeOption) {
      selectedSize.value = sizeOption.value;
    }

    setVariantId(initialVariant);
  }
};

watch(
  () => props.product,
  () => {
    setInitialVariant();
  },
  { immediate: true }
);

const isMatchingVariant = (variant: ProductVariantFragment, size: string) =>
  variant.selectedOptions.every(({ name, value }) =>
    sizeOptionNames.includes(name) ? value === size : true
  );

watch(selectedSize, (size) => {
  currentVariant.value = variants.value.find((variant) =>
    isMatchingVariant(variant, size)
  );
});

watch(currentVariant, (newVariant) => {
  setVariantId(newVariant);
});
</script>

<template>
  <div class="relative lg:sticky lg:top-[calc(var(--header-height)+1px)]">
    <div class="flex flex-col gap-5 w-full lg:md:max-w-lg lg:pt-20 lg:mx-auto">
      <ProductHeader
        :product="product"
        :current-variant="currentVariant"
      />
      <ProductColorOptions
        :product="product"
        :matching-colors="matchingColors"
      />
      <ProductSizeOptions
        :product="product"
        :selected-size="selectedSize"
        @select-size="selectSize"
      />
      <button
        :disabled="isLoading || !currentVariant || !currentVariant.availableForSale"
        class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200 disabled:opacity-60 disabled:hover:bg-zinc-100"
        @click="addToCart"
      >
        {{ isLoading ? 'Adding...' : addToCartText }}
      </button>
      <ProductDetails
        :description="product.descriptionHtml"
        :details="product.details?.value"
        :shipping="product.shipping?.value"
      />
    </div>
  </div>
</template>
