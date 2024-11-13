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

// Stores
const appStore = useAppStore();
const cartStore = useCartStore();

// State
const selectedSize = ref('');
const currentVariant = ref<ProductVariantFragment | undefined>(undefined);
const isLoading = ref(false);

// Computed
const variants = computed(() => flattenConnection(props.product.variants));

const addToCartText = computed(() => {
  if (variants.value.length === 1) {
    return currentVariant.value?.availableForSale ? 'Add to Cart' : 'Sold Out';
  }
  if (!selectedSize.value) return 'Select Size';
  if (currentVariant.value?.availableForSale) return 'Add to Cart';

  return 'Sold Out';
});

onMounted(() => {
  const variantId = route.query.variant as string;
  const sizeOptionNames = ['Size', 'Length'];

  // If only one variant exists, set it as the current variant
  if (variants.value.length === 1) return (currentVariant.value = variants.value[0]);

  // If a variant ID is provided in the URL
  if (variantId) {
    const urlVariant = variants.value.find(
      variant => formatVariantId(variant.id) === variantId,
    );

    // If the URL variant is found, set the selected size
    if (urlVariant) {
      const sizeOption = urlVariant.selectedOptions.find(option =>
        sizeOptionNames.includes(option.name),
      );

      if (sizeOption) {
        selectedSize.value = sizeOption.value;
      }
    }
  }
});

// Update URL variantId
const updateUrlParams = (variant: ProductVariantFragment | undefined) => {
  const query = { ...route.query };

  if (variant) {
    query.variant = formatVariantId(variant.id);
  }
  else {
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
        quantity: 1,
      },
    ]);

    openDrawer();
  }
  catch (error) {
    console.error('Failed to add item to cart', error);
  }
  finally {
    isLoading.value = false;
  }
};

// Watchers
watch(selectedSize, (size) => {
  const sizeOptionNames = ['Size', 'Length'];
  return currentVariant.value = variants.value.find(variant =>
    variant.selectedOptions.every(({ name, value }) =>
      sizeOptionNames.includes(name) ? value === size : true,
    ),
  );
});

watch(currentVariant, (newVariant) => {
  updateUrlParams(newVariant);
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
    </div>
  </div>
</template>
