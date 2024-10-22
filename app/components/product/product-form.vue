<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
  relatedProducts: ProductFragment[]
}>();

// Route data
const route = useRoute();
const handle = computed(() => route.params.handle as string);

// Helpers
const { getColorOption } = useProductHelpers();

// Computed
const productOptions = computed(() => props.product?.options);
const productOptionColor = computed(() => getColorOption(productOptions.value));

const mainProductColor = computed(() => {
  const options = props.product?.options;
  const colorOption = getColorOption(options);

  return {
    name: colorOption?.optionValues[0]?.name,
    color: colorOption?.optionValues[0]?.swatch?.color,
    image: colorOption?.optionValues[0]?.swatch?.image?.url,
    handle: props.product?.handle
  };
});

const relatedProductColors = computed(() => {
  return props.relatedProducts.map((relatedProduct) => {
    const options = relatedProduct.options;
    const colorOption = getColorOption(options);

    return {
      name: colorOption?.optionValues[0]?.name,
      color: colorOption?.optionValues[0]?.swatch?.color,
      image: colorOption?.optionValues[0]?.swatch?.image?.url,
      handle: relatedProduct.handle
    };
  });
});

// Combine all colors, sort alphabetically
const sortedColors = computed(() => {
  const allColors = [mainProductColor.value, ...relatedProductColors.value];
  return allColors.sort((a, b) => a.name.localeCompare(b.name));
});

// Refs
const colorName = ref<string>(mainProductColor.value.name);

// Update color name
const updateColorName = (name: string) => {
  colorName.value = name;
};

// Reset color name
const resetColorName = () => {
  colorName.value = mainProductColor.value.name;
};
</script>

<template>
  <div class="relative lg:sticky lg:top-[calc(var(--header-height)+1px)]">
    <div class="flex flex-col gap-4 w-full lg:md:max-w-lg lg:pt-20 lg:mx-auto">
      <!-- Info -->
      <div class="flex flex-col gap-2">
        <h1 class="normal-case text-xl tracking-tight leading-none">
          {{ product.title }}
        </h1>
        <price-display
          :price="product.priceRange.minVariantPrice"
          :compare-at-price-range="product.compareAtPriceRange.minVariantPrice"
          class="text-xl"
        />
      </div>
      <!-- Swatches -->
      <div v-if="productOptionColor" class="flex flex-col gap-2">
        <span>color: {{ colorName }}</span>
        <div class="flex items-center gap-2">
          <div v-if="sortedColors.length" class="flex flex-wrap gap-2">
            <nuxt-link
              v-for="color in sortedColors"
              :key="color.handle"
              :to="`/products/${color.handle}`"
              class="flex h-8 w-8 shrink-0 rounded-full hover:outline-black"
              :class="[
                color.handle === handle
                  ? 'outline outline-1 outline-black border-4 border-white'
                  : 'outline outline-1 outline-gray-200'
              ]"
              :style="{
                background:
                  color.name?.toLowerCase() !== 'multicolor'
                    ? color.color
                    : 'linear-gradient(315deg, rgba(242,242,242,1) 0%, rgba(242,242,242,1) 50%, rgba(24,23,23,1) 52%, rgba(24,23,23,1) 100%)'
              }"
              @mouseenter="updateColorName(color.name)"
              @mouseleave="resetColorName"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
