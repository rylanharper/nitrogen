<script setup lang="ts">
import type { ProductOptionFragment, ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  options: ProductOptionFragment[];
  relatedProducts: ProductFragment[];
}>();

// Route data
const route = useRoute();
const handle = computed(() => route.params.handle as string);

// Helpers
const { getColorOption } = useProductHelpers();

// Computed
const productOptionColor = computed(() => getColorOption(props.options));

// Get product colors
const mainProductColor = computed(() => {
  const colorOption = getColorOption(props.options);

  return {
    name: colorOption?.optionValues[0]?.name,
    color: colorOption?.optionValues[0]?.swatch?.color,
    image: colorOption?.optionValues[0]?.swatch?.image?.previewImage,
    handle: handle.value,
  };
});

const relatedProductColors = computed(() => {
  return props.relatedProducts.map((relatedProduct) => {
    const options = relatedProduct.options;
    const colorOption = getColorOption(options);

    return {
      name: colorOption?.optionValues[0]?.name,
      color: colorOption?.optionValues[0]?.swatch?.color,
      image: colorOption?.optionValues[0]?.swatch?.image?.previewImage,
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
const colorName = ref<string | undefined>(mainProductColor.value.name);

// Update color name
const updateColorName = (name: string) => {
  colorName.value = name;
};

// Reset color name
const resetColorName = () => {
  colorName.value = mainProductColor.value.name;
};

// Watchers
watch(mainProductColor, (newColor) => {
  colorName.value = newColor.name;
});
</script>

<template>
  <div v-if="productOptionColor" class="flex flex-col gap-2">
    <span>color: {{ colorName }}</span>
    <div class="flex flex-wrap gap-2">
      <nuxt-link
        v-for="color in sortedColors"
        :key="color.handle"
        :to="`/products/${color.handle}`"
        :class="[
          color.handle === handle
            ? 'outline outline-1 outline-black border-4 border-white'
            : 'outline outline-1 outline-gray-100',
          color.image
            ? 'flex aspect-square size-12 shrink-0 border-none rounded-sm overflow-hidden'
            : 'flex size-8 shrink-0 rounded-full'
        ]"
        :style="color.image ? null : { background: color.color }"
        @mouseenter="updateColorName(color.name)"
        @mouseleave="resetColorName"
      >
        <template v-if="color.image">
          <shopify-image
            :image="color.image"
            :alt="color.image?.altText || ''"
          />
        </template>
      </nuxt-link>
    </div>
  </div>
</template>



