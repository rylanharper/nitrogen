<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
}>();

// Computed
const productMedia = computed(() => flattenNodeConnection(props.product?.media));
const productImage = computed(() => flattenNodeConnection(props.product?.images));

// Find video (if any exist)
const productVideo = computed(() => productMedia.value.find((item) => item.mediaContentType === 'VIDEO'));
</script>

<template>
  <div class="relative overflow-hidden aspect-square">
    <div v-if="product && productVideo">
      <div class="absolute top-0 left-0 size-full">
        <shopify-image
          :image="productImage[0]"
          :alt="productImage[0].altText || product.title"
        />
      </div>
      <div class="absolute top-0 left-0 size-full opacity-0 transition duration-150 ease-in-out hover:lg:opacity-100">
        <shopify-video :video="productVideo" />
      </div>
    </div>
    <div v-if="product && !productVideo">
      <div class="absolute top-0 left-0 size-full">
        <shopify-image
          :image="productImage[0]"
          :alt="productImage[0].altText || product.title"
        />
      </div>
      <div class="absolute top-0 left-0 size-full opacity-0 transition duration-150 ease-in-out hover:lg:opacity-100">
        <shopify-image
          :image="productImage[1]"
          :alt="productImage[1].altText || product.title"
        />
      </div>
    </div>
  </div>
</template>
