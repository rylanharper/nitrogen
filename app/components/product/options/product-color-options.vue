<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
  relatedProducts: ProductFragment[];
}>();

// Route data
const route = useRoute();
const handle = computed(() => route.params.handle as string);

// Helpers
const { getColorOption } = useProductHelpers();

// Computed
const isColorOption = computed(() => getColorOption(props.product.options));
const defaultColor = computed(() => isColorOption.value?.optionValues[0]?.name);

// Get product color options
const mainProductColor = computed(() => {
  const colorOption = getColorOption(props.product.options);

  return {
    name: colorOption?.optionValues[0]?.name,
    color: colorOption?.optionValues[0]?.swatch?.color,
    image: colorOption?.optionValues[0]?.swatch?.image?.previewImage,
    handle: props.product.handle,
    isAvailable: props.product.availableForSale
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
      handle: relatedProduct.handle,
      isAvailable: relatedProduct.availableForSale
    };
  });
});

// Combine all colors, sort alphabetically
const sortedColors = computed(() => {
  const allColors = [mainProductColor.value, ...relatedProductColors.value];
  return allColors.sort((a, b) => a.name.localeCompare(b.name));
});

// State
const colorName = ref(defaultColor.value);

// Actions
function updateColorName(name: string | undefined) {
  colorName.value = name;
};

function resetColorName() {
  colorName.value = defaultColor.value;
};
</script>

<template>
  <div v-if="isColorOption" class="flex flex-col gap-2">
    <span>color: {{ colorName }}</span>
    <div class="flex flex-wrap gap-2">
      <NuxtLink
        v-for="color in sortedColors"
        :key="color.handle"
        :to="`/products/${color.handle}`"
        class="relative flex h-8 w-8 shrink-0 outline outline-1 rounded-full overflow-hidden hover:outline-black"
        :class="[
          color.handle === handle
            ? 'outline-black border-4 border-white'
            : 'outline-gray-200',
          !color.isAvailable
            ? 'text-zinc-400 after:h-px after:w-[150%] after:-rotate-[28deg] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-zinc-300'
            : 'text-black'
        ]"
        :style="{ background: color.color }"
        :ariaLabel="`Color Option ${color.name}`"
        @mouseenter="updateColorName(color.name)"
        @mouseleave="resetColorName"
      />
    </div>
  </div>
</template>
