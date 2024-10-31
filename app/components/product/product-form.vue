<script setup lang="ts">
import type { ProductFragment, ProductVariantFragment } from '@@/types/shopify';

// Route data
const props = defineProps<{
  product: ProductFragment;
  relatedProducts: ProductFragment[];
}>();

// Router
const route = useRoute();
const router = useRouter();

// Stores
const appStore = useAppStore();
const cartStore = useCartStore();

// Computed
const variants = computed(() => flattenNodeConnection(props.product.variants));

// State
const selectedSize = ref('');
const currentVariant = ref<ProductVariantFragment | undefined>(undefined);
const isLoading = ref(false);

// Select size
function selectSizeOption(size: string) {
  selectedSize.value = size;
}

// Size options
const sizeOptionNames = ['Size', 'Length'];

// Set selected size and current variant from URL
onMounted(() => {
  const variantId = route.query.variant as string | undefined;

  // If a variant ID is provided in the URL
  if (variantId) {
    const urlVariant = variants.value.find(
      (variant) => formatVariantId(variant.id) === variantId
    );

    // If the URL variant is found, set the selected size
    if (urlVariant) {
      const sizeOption = urlVariant.selectedOptions.find((option) =>
        sizeOptionNames.includes(option.name)
      );

      if (sizeOption) {
        selectedSize.value = sizeOption.value;
      }
    }
    // If only one variant exists, set it as the current variant
  } else if (variants.value.length === 1) {
    currentVariant.value = variants.value.find((variant) => variant.availableForSale) ?? variants.value[0];
  }
});

// Update URL to add variant ID
function updateUrlParams(variant: ProductVariantFragment | undefined) {
  const query = { ...route.query };

  if (variant) {
    query.variant = formatVariantId(variant.id);
  } else {
    delete query.variant;
  }

  router.replace({ query });
}

// Watchers
watch(selectedSize, (size) => {
  currentVariant.value = variants.value.find((variant) =>
    variant.selectedOptions.every(({ name, value }) =>
      sizeOptionNames.includes(name) ? value === size : true
    )
  );
});

watch(currentVariant, (newVariant) => {
  updateUrlParams(newVariant);
});

// Add-to-cart text
const addToCartText = computed(() => {
  if (!selectedSize.value) return 'Select Size';
  if (!currentVariant.value?.availableForSale) return 'Sold Out';
  return 'Add to Cart';
});

// Open drawer
function openDrawer() {
  appStore.cartDrawerOpen = true;
}

// Add to cart
async function addToCart() {
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
    console.error('Failed to add item to cart', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="relative lg:sticky lg:top-[calc(var(--header-height)+1px)]">
    <div class="flex flex-col gap-5 w-full lg:md:max-w-lg lg:pt-20 lg:mx-auto">
      <product-header
        :product="product"
        :currentVariant="currentVariant"
      />
      <product-color-options
        :product="product"
        :relatedProducts="relatedProducts"
      />
      <product-size-options
        :product="product"
        :selectedSize="selectedSize"
        @selectSizeOption="selectSizeOption"
      />
      <button
        @click="addToCart"
        :disabled="isLoading || !currentVariant || !currentVariant.availableForSale"
        class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200 disabled:opacity-60 disabled:hover:bg-zinc-100"
      >
        {{ isLoading ? 'Adding...' : addToCartText }}
      </button>
    </div>
  </div>
</template>
