<script setup lang="ts">
import type { ProductQueryVariables } from '@@/types/shopify';

// Route data
const route = useRoute();
const handle = computed(() => route.params.handle as string);

// Stores
const appStore = useAppStore();
const shopStore = useShopStore();

// Shopify
const shopify = useShopify();

// Fetch data
const productVars = computed<ProductQueryVariables>(() => ({
  handle: handle.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}))

const { data: productData } = await fetchData('product', productVars, shopify.product.get);

// Computed data
const product = computed(() => productData.value)
const productImages = computed(() => flattenNodeConnection(product.value?.images))
const productVariants = computed(() => flattenNodeConnection(product.value?.variants))
const mediaItems = computed(() => flattenNodeConnection(product.value?.media))

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
</script>

<template>
  <section class="relative grid lg:grid-cols-2">
    <div>
      <product-media-gallery :product="product" @openLightbox="openLightbox" />
      <product-media-carousel :product="product" />
    </div>
    <div></div>
  </section>
  <product-media-lightbox
    v-if="isLightboxOpen"
    :mediaItems="mediaItems"
    :current-index="currentMediaIndex"
    @close="closeLightbox"
    @update:current-index="currentMediaIndex = $event"
  />
</template>
