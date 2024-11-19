<script setup lang="ts">
import type { ProductQueryVariables, ProductFragment } from '@@/types/shopify';

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
const productMedia = computed(() => flattenConnection(product.value?.media));
const productRecommendations = computed(() => recommendationData.value?.slice(0, 4) || []);

// Matching color references (if any)
const matchingColors = computed(() => {
  const references = product.value?.matching_colors?.references;
  return references ? flattenConnection(references) as ProductFragment[] : [];
});

// State
const mediaIndex = ref<number>(0);
const isLightboxOpen = ref(false);

// Actions
const openLightbox = (index: number) => {
  mediaIndex.value = index;
  isLightboxOpen.value = true;
};;

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

// Watchers
const isScrollLocked = useScrollLock(document);

watch(isLightboxOpen, (isOpen) => {
  isScrollLocked.value = isOpen;
});

// SEO
useHead({
  title: product.value?.title
});
</script>

<template>
  <section v-if="product" class="flex flex-col mb-20">
    <ProductMediaLightbox
      v-if="isLightboxOpen"
      :media-index="mediaIndex"
      :product-media="productMedia"
      @close-lightbox="closeLightbox"
    />
    <div class="grid gap-10 mb-10 lg:grid-cols-2 lg:gap-0 lg:mb-20">
      <div>
        <ProductMediaGallery
          :product-media="productMedia"
          @open-lightbox="openLightbox"
        />
        <ProductMediaCarousel
          :product-media="productMedia"
        />
      </div>
      <div class="px-6">
        <ProductForm
          :product="product"
          :matching-colors="matchingColors"
        />
      </div>
    </div>
    <div class="px-6">
      <ProductRecommendations :products="productRecommendations" />
    </div>
  </section>
  <section v-else class="flex items-center gap-2 p-6">
    <Icon name="ph:warning-circle" class="h-5 w-5 shrink-0" />
    <p class="normal-case">No Product data found.</p>
  </section>
</template>
