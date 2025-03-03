<script setup lang="ts">
import type { ProductQueryVariables, ProductFragment } from '@@/types/shopify';

import { flattenConnection } from '@/utils/graphql';

// Route data
const route = useRoute();
const handle = computed(() => route.params.handle as string);

// Stores
const shopStore = useShopStore();

// Shopify
const shopify = useShopify();

// Fetch data
const productVars = computed<ProductQueryVariables>(() => ({
  handle: handle.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data: productData } = await useAsyncData(
  `product-${handle.value}`,
  () => shopify.product.get(productVars.value),
  { watch: [productVars] }
);

const { data: recommendationData } = await useAsyncData(
  `recommended-${handle.value}`,
  () => shopify.product.recommended(productVars.value),
  { watch: [productVars], lazy: true }
);

// Computed data
const product = computed(() => productData.value);
const productColorReferences = computed(() => productData.value?.matching_colors?.references);
const productRecommendations = computed(() => recommendationData.value?.slice(0, 4));

// Flatten connections
const productMedia = computed(() => flattenConnection(product.value?.media));
const productVariants = computed(() => flattenConnection(product.value?.variants));

// Get/flatten matching color references (if any)
const matchingColors = computed(() =>
  productColorReferences.value
    ? flattenConnection(productColorReferences.value) as ProductFragment[]
    : []
);

// SEO
useHead({
  title: product.value?.title
});
</script>

<template>
  <section v-if="product" class="flex flex-col mb-20">
    <div class="grid gap-10 mb-10 lg:grid-cols-2 lg:gap-0 lg:mb-20">
      <div>
        <ProductMediaGallery :product-media="productMedia" />
        <ProductMediaCarousel :product-media="productMedia" />
      </div>
      <div class="px-6">
        <ProductForm
          :product="product"
          :variants="productVariants"
          :matching-colors="matchingColors"
        />
      </div>
    </div>
    <div class="px-6">
      <ProductRecommendations :products="productRecommendations" />
    </div>
  </section>
  <section v-else class="flex items-center gap-2 p-6">
    <Icon name="ph:warning-circle" class="size-5 shrink-0" />
    <p>No Product data found.</p>
  </section>
</template>
