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
const initialVariant = ref<ProductVariantFragment | undefined>();
const currentVariant = ref<ProductVariantFragment | undefined>();

// Set formatted variant ID to URL query
const setVariantId = (variant: ProductVariantFragment | undefined) => {
  const query = { ...route.query };

  if (variant) {
    query.variant = formatVariantId(variant.id);
  } else {
    delete query.variant;
  }

  router.replace({ query });
};

// Sync initial variant from available options or URL query
// Defaults to undefined if no match is found
onMounted(() => {
  if (props.variants.length === 1) {
    initialVariant.value = props.variants[0];
  } else if (variantQuery.value) {
    initialVariant.value = props.variants.find(
      (variant) => formatVariantId(variant.id) === variantQuery.value
    );
  }

  if (initialVariant.value) {
    const sizeOption = initialVariant.value.selectedOptions.find(
      (option) => isSizeOption(option.name)
    );

    if (sizeOption) {
      selectedSize.value = sizeOption.value;
    }

    setVariantId(initialVariant.value);
  }
});

// Actions
const selectSize = (size: string) => {
  selectedSize.value = size;
};

// Watchers
watchEffect(() => {
  currentVariant.value = props.variants.find((variant) =>
    variant.selectedOptions.every(({ name, value }) =>
      isSizeOption(name) ? value === selectedSize.value : true
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
        :variants="variants"
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
