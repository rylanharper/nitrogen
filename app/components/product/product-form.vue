<script setup lang="ts">
import type { ProductFragment, ProductVariantFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
  variants: ProductVariantFragment[];
  matchingColors: ProductFragment[];
}>();

// Constants
const sizeOptionNames = ['Size', 'Length'];

// Route data
const route = useRoute();
const router = useRouter();
const variantId = computed(() => route.query.variant as string);

// State
const selectedSize = ref('');
const currentVariant = ref<ProductVariantFragment | undefined>(undefined);

// Actions
const selectSize = (size: string) => {
  selectedSize.value = size;
};

// Set query params
const setVariantId = (variant: ProductVariantFragment | undefined) => {
  const query = { ...route.query };

  if (variant) {
    query.variant = formatVariantId(variant.id);
  } else {
    delete query.variant;
  }

  router.replace({ query });
};

// Get and set initial variant
const getInitialVariant = () => {
  // If there is only one variant, get that one
  if (props.variants.length === 1) return props.variants[0];
  // If the variant ID is set in the route query, get that one
  if (variantId.value) {
    return props.variants.find((variant) => formatVariantId(variant.id) === variantId.value);
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

// Watchers
watch(
  () => props.product,
  () => {
    setInitialVariant();
  },
  { immediate: true }
);

watch(selectedSize, (size) => {
  currentVariant.value = props.variants.find((variant) =>
    variant.selectedOptions.every(({ name, value }) =>
      sizeOptionNames.includes(name) ? value === size : true
    )
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
      <ProductAddToCart
        :current-variant="currentVariant"
        :variants="variants"
      />
      <ProductDetails
        :description="product.descriptionHtml"
        :details="product.details?.value"
        :shipping="product.shipping?.value"
      />
    </div>
  </div>
  <KlaviyoBackInStockModal
    :variant-id="variantId"
  />
</template>
