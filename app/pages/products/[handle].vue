<script setup lang="ts">
import type { ProductQueryVariables } from '@@/types/shopify';

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

// Computed data
const product = computed(() => productData.value);
const mediaItems = computed(() => flattenNodeConnection(product.value?.media));

// Get related products (if any)
const relatedProducts = computed(() =>
  product.value?.related_products?.references
    ? flattenNodeConnection(product.value.related_products.references)
    : []
);

// Lightbox state
const isLightboxOpen = ref(false);
const currentMediaIndex = ref(0);

// Watchers
const isScrollLocked = useScrollLock(document);

watch(isLightboxOpen, (isOpen) => {
  isScrollLocked.value = isOpen;
});

// Open lightbox
const openLightbox = (index: number) => {
  currentMediaIndex.value = index;
  isLightboxOpen.value = true;
};

// Close lightbox
const closeLightbox = () => {
  isLightboxOpen.value = false;
};

// SEO
useHead({
  title: product.value?.title
});
</script>

<template>
  <section v-if="product" class="relative grid gap-10 lg:grid-cols-2 lg:gap-0">
    <div class="flex flex-col">
      <product-media-gallery :mediaItems="mediaItems" @openLightbox="openLightbox" />
      <product-media-carousel :mediaItems="mediaItems" />
    </div>
    <div class="flex flex-col px-6">
      <product-form :product="product" :relatedProducts="relatedProducts" />
    </div>
  </section>
  <product-media-lightbox
    v-if="isLightboxOpen"
    :mediaItems="mediaItems"
    :current-index="currentMediaIndex"
    @close="closeLightbox"
  />
</template>
