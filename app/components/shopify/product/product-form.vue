<script setup lang="ts">
import type { ProductFragment, ProductVariantFragment } from '#shopify/storefront'
import type { LocationQuery } from 'vue-router'

// Props
const props = defineProps<{
  product: ProductFragment
  variants: ProductVariantFragment[]
  matchingColors: ProductFragment[]
}>()

// Composables
const route = useRoute()
const router = useRouter()

// State
const selectedSize = ref('')

// Variant matching
const variantQuery = computed(() => route.query.variant as string | undefined)

const currentVariant = computed(() =>
  props.variants.find((variant) =>
    variant.selectedOptions.every(({ name, value }) => !isSizeOption(name) || value === selectedSize.value),
  ),
)

// Actions
const setVariantId = (variant: ProductVariantFragment | undefined) => {
  const query: LocationQuery = { ...route.query }

  if (variant) query.variant = parseGid(variant.id)
  else delete query.variant

  router.replace({ query })
}

const setSizeOption = (size: string) => {
  selectedSize.value = size
}

// Initialization
onMounted(() => {
  const initialVariant = props.variants.length === 1
    ? props.variants[0]
    : props.variants.find((v) => parseGid(v.id) === variantQuery.value)

  if (initialVariant) {
    const sizeOption = initialVariant.selectedOptions.find((option) => isSizeOption(option.name))
    if (sizeOption) selectedSize.value = sizeOption.value
    setVariantId(initialVariant)
  }
})

// Watchers
watch(currentVariant, setVariantId)
</script>

<template>
  <div class="relative lg:sticky lg:top-[calc(var(--header-height)+1px)]">
    <div class="flex flex-col gap-5 w-full lg:md:max-w-lg lg:pt-20 lg:mx-auto">
      <FormHeader
        :product="product"
        :current-variant="currentVariant"
      />
      <FormColorOptions
        :product="product"
        :matching-colors="matchingColors"
      />
      <FormSizeOptions
        :product="product"
        :variants="variants"
        :selected-size="selectedSize"
        @set-size-option="setSizeOption"
      />
      <FormAddToCart
        :current-variant="currentVariant"
        :variants="variants"
      />
      <FormDetails
        :description="product.descriptionHtml"
        :details="product.details?.value"
        :shipping="product.shipping?.value"
      />
    </div>
  </div>
</template>
