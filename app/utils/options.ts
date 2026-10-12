import type {
  ProductOptionFragment,
  ProductVariantFragment,
} from '#shopify/storefront'

/**
 * Checks if an option name is a size option.
 * @param name - The option name
 */
export const isSizeOption = (name: string): boolean => {
  const sizeOptions = ['Size', 'Length']
  return sizeOptions.includes(name)
}

/**
 * Checks if an option name is a color option.
 * @param name - The option name
 */
export const isColorOption = (name: string): boolean => {
  const colorOptions = ['Color', 'Colour']
  return colorOptions.includes(name)
}

/**
 * Finds the size option in a product's options.
 * @param optionInput - The product options
 */
export const getSizeOption = (optionInput: ProductOptionFragment[]) => {
  return optionInput.find((option) => isSizeOption(option.name)) ?? null
}

/**
 * Finds the color option in a product's options.
 * @param optionInput - The product options
 */
export const getColorOption = (optionInput: ProductOptionFragment[]) => {
  return optionInput.find((option) => isColorOption(option.name)) ?? null
}

const isOptionSoldOut = (
  variants: ProductVariantFragment[],
  isOption: (name: string) => boolean,
  value: string,
): boolean => {
  const matches = variants.filter((variant) =>
    variant.selectedOptions.some((option) => isOption(option.name) && option.value === value),
  )
  return matches.length > 0 && matches.every((variant) => !variant.availableForSale)
}

/**
 * Checks if every variant with the given size is sold out.
 * @param variants - The product variants
 * @param sizeValue - The size value
 */
export const isSizeSoldOut = (variants: ProductVariantFragment[], sizeValue: string): boolean =>
  isOptionSoldOut(variants, isSizeOption, sizeValue)

/**
 * Checks if every variant with the given color is sold out.
 * @param variants - The product variants
 * @param colorValue - The color value
 */
export const isColorSoldOut = (variants: ProductVariantFragment[], colorValue: string): boolean =>
  isOptionSoldOut(variants, isColorOption, colorValue)

/**
 * Sorts sizes with letter sizes first, then numbers, then the rest alphabetically.
 * @param sizes - The sizes to sort
 */
export const sortSizeOptions = (sizes: string[]) => {
  const letterSizes = ['One Size', 'OS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
  const letterSizeMap = new Map(letterSizes.map((size, index) => [size, index]))

  return [...sizes].sort((a, b) => {
    const indexA = letterSizeMap.get(a)
    const indexB = letterSizeMap.get(b)

    if (indexA !== undefined && indexB !== undefined) {
      return indexA - indexB
    }
    if (indexA !== undefined) return -1
    if (indexB !== undefined) return 1

    const numA = parseFloat(a)
    const numB = parseFloat(b)

    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB
    }

    return a.localeCompare(b)
  })
}
