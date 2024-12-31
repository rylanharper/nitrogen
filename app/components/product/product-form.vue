<script setup lang="ts">
import type { ProductFragment, ProductVariantFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
  variants: ProductVariantFragment[];
  matchingColors: ProductFragment[];
}>();

// Route data
const route = useRoute();
const router = useRouter();
const variantQuery = computed(() => route.query.variant as string);

// State
const selectedSize = ref('');

// Finds/updates the current variant
const isMatchingVariant = (variant: ProductVariantFragment) => {
  return variant.selectedOptions.every(({ name, value }) =>
    isSizeOption(name) ? value === selectedSize.value : true
  );
};

const currentVariant = computed(() => {
  return props.variants.find(isMatchingVariant);
});

// Get initial variant
const getInitialVariant = () => {
  if (props.variants.length === 1) return props.variants[0];

  if (variantQuery.value) {
    return props.variants.find((variant) => formatVariantId(variant.id) === variantQuery.value);
  }

  return undefined;
};

// Set formatted variant ID to URL
const setVariantId = (variant: ProductVariantFragment | undefined) => {
  const query = { ...route.query };

  if (variant) {
    query.variant = formatVariantId(variant.id);
  } else {
    delete query.variant;
  }

  router.replace({ query });
};

// Set initial variant and sync size
onMounted(() => {
  const initialVariant = getInitialVariant();

  if (initialVariant) {
    const sizeOption = initialVariant.selectedOptions.find((option) =>
      isSizeOption(option.name)
    );

    if (sizeOption) {
      selectedSize.value = sizeOption.value;
    }

    setVariantId(initialVariant);
  }
});

// Actions
const selectSize = (size: string) => {
  selectedSize.value = size;
};

// Watchers
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
    :variant-id="variantQuery"
  />
</template>
