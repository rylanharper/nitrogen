import type {
  ProductCollectionSortKeys,
  SearchSortKeys,
  ProductFilter,
  MoneyFragment,
  VideoFragment,
  MediaImageFragment,
  ProductOptionFragment,
  ProductVariantFragment,
} from '@@/types/shopify-storefront'

/**
 * Gets the collection sort values from the URL query.
 * @param sortParam - The sort URL parameter
 * @returns An object containing the sort and reverse key
 */
export const getCollectionSortValues = (sortParam: string | null): {
  sortKey: ProductCollectionSortKeys
  reverse: boolean
} => {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      }
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      }
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      }
    default:
      return {
        sortKey: 'CREATED',
        reverse: true,
      }
  }
}

/**
 * Gets the search sort values from the URL query.
 * @param sortParam - The sort URL parameter
 * @returns An object containing the sort and reverse key
 */
export const getSearchSortValues = (sortParam: string | null): {
  sortKey: SearchSortKeys
  reverse: boolean
} => {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      }
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      }
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      }
  }
}

/**
 * Gets the filter values from the URL query.
 * @param query - The URL query object containing potential filter values
 * @returns An array of filters to apply to the collection
 */
export const getFilterValues = (query: Record<string, any>) => {
  const filters: ProductFilter[] = []
  const { color, size, productType } = query

  if (color || size || productType) {
    filters.push({
      available: true,
    })
  }

  if (color) {
    color.split(',').forEach((color: any) => {
      filters.push({
        variantOption: {
          name: 'Color',
          value: color,
        },
      })
    })
  }

  if (size) {
    size.split(',').forEach((size: any) => {
      filters.push({
        variantOption: {
          name: 'Size',
          value: size,
        },
      })
    })
  }

  if (productType) {
    productType.split(',').forEach((productType: any) => {
      filters.push({
        productType: productType,
      })
    })
  }

  return filters
}

/**
 * Sorts an array of sizes, prioritizing letter sizes first, then number sizes.
 * @param sizes - The array of sizes to sort
 * @returns An array of sorted sizes
 */
export const sortSizeOptions = (sizes: string[]) => {
  const letterSizes = ['One Size', 'OS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
  const letterSizeMap = new Map(letterSizes.map((size, index) => [size, index]))

  return sizes.sort((a, b) => {
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

/**
 * Checks if a product is considered new based on its creation date.
 * @param date - The creation date of the product
 * @param daysOld - Number of days to consider a product new (default: 30)
 * @returns A boolean indicating if the product is new
 */
export const isNewItem = (date: string, daysOld = 30): boolean => {
  const dayInMs = 24 * 60 * 60 * 1000
  return new Date(date).getTime() > Date.now() - daysOld * dayInMs
}

/**
 * Checks if a product is sold out based on its availability.
 * @param product - The product object containing availability information
 * @returns A boolean indicating if the product is sold out
 */
export const isSoldOut = (availableForSale: boolean): boolean => {
  return !availableForSale
}

/**
 * Determines if a product is on sale by comparing its current price to its original price.
 * @param price - The current price of the product
 * @param compareAtPrice - The original price of the product
 * @returns A boolean indicating if the product is on sale
 */
export const isOnSale = (price: MoneyFragment, compareAtPrice: MoneyFragment): boolean => {
  return compareAtPrice.amount > price.amount
}

/**
 * Checks if a media item is a video.
 * @param media - The media item to check
 * @returns A boolean indicating if the media is a video
 */
export const isMediaVideo = (media: any): media is VideoFragment => {
  return media?.mediaContentType === 'VIDEO'
}

/**
 * Checks if a media item is an image.
 * @param media - The media item to check
 * @returns A boolean indicating if the media is an image
 */
export const isMediaImage = (media: any): media is MediaImageFragment => {
  return media?.mediaContentType === 'IMAGE'
}

/**
 * Checks if a given option name corresponds to a size option.
 * @param name - The option name to check
 * @returns A boolean indicating whether the name is a size option
 */
export const isSizeOption = (name: string): boolean => {
  const sizeOptions = ['Size', 'Length']
  return sizeOptions.includes(name)
}

/**
 * Checks if a given option name corresponds to a color option.
 * @param name - The option name to check
 * @returns A boolean indicating whether the name is a color option
 */
export const isColorOption = (name: string): boolean => {
  const colorOptions = ['Color', 'Colour']
  return colorOptions.includes(name)
}

/**
 * Finds the color option from a product's option list.
 * @param optionInput - Array of product options
 * @returns The color option if found, null otherwise
 */
export const getColorOption = (optionInput: ProductOptionFragment[]) => {
  return optionInput.find((option) => isColorOption(option.name)) ?? null
}

/**
 * Finds the size option from a product's option list.
 * @param optionInput - Array of product options
 * @returns The size option if found, null otherwise
 */
export const getSizeOption = (optionInput: ProductOptionFragment[]) => {
  return optionInput.find((option) => isSizeOption(option.name)) ?? null
}

/**
 * Checks if a specific size is sold out across all variants.
 * @param variants - Array of product variants
 * @param sizeValue - The size value to check
 * @returns A boolean indicating if the size is sold out
 */
export const isSizeSoldOut = (variants: ProductVariantFragment[], sizeValue: string): boolean => {
  const sizeVariants = variants.filter((variant) =>
    variant.selectedOptions.some((option) =>
      isSizeOption(option.name) && option.value === sizeValue,
    ),
  )

  if (!sizeVariants.length) return false
  return sizeVariants.every((variant) => !variant.availableForSale)
}

/**
 * Checks if a specific color is sold out across all variants.
 * @param variants - Array of product variants
 * @param colorValue - The color value to check
 * @returns A boolean indicating if the color is sold out
 */
export const isColorSoldOut = (variants: ProductVariantFragment[], colorValue: string): boolean => {
  const colorVariants = variants.filter((variant) =>
    variant.selectedOptions.some((option) =>
      isColorOption(option.name) && option.value === colorValue,
    ),
  )

  if (!colorVariants.length) return false
  return colorVariants.every((variant) => !variant.availableForSale)
}
