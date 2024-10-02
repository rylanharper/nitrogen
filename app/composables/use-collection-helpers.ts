import type { ProductCollectionSortKeys, SearchSortKeys, ProductFilter, ProductFragment } from '@@/types/shopify'

export function useCollectionHelpers() {
  /**
   * Extracts the collection sort values from the URL query.
   * @param sortParam - The sort parameter from the URL.
   * @returns An object containing the sort key and whether the sort should be reversed.
   */
  const getCollectionSortValuesFromUrl = (
    sortParam: string | null
  ): {
    sortKey: ProductCollectionSortKeys
    reverse: boolean
  } => {
    switch (sortParam) {
      case 'price-high-low':
        return {
          sortKey: 'PRICE',
          reverse: true
        }
      case 'price-low-high':
        return {
          sortKey: 'PRICE',
          reverse: false
        }
      case 'best-selling':
        return {
          sortKey: 'BEST_SELLING',
          reverse: false
        }
      case 'newest':
        return {
          sortKey: 'CREATED',
          reverse: true
        }
      default:
        return {
          sortKey: 'MANUAL',
          reverse: false
        }
    }
  }

  /**
   * Extracts the search sort values from the URL query.
   * @param sortParam - The sort parameter from the URL.
   * @returns An object containing the sort key and whether the sort should be reversed.
   */
  const getSearchSortValuesFromUrl = (
    sortParam: string | null
  ): {
    sortKey: SearchSortKeys
    reverse: boolean
  } => {
    switch (sortParam) {
      case 'price-high-low':
        return {
          sortKey: 'PRICE',
          reverse: true
        }
      case 'price-low-high':
        return {
          sortKey: 'PRICE',
          reverse: false
        }
      default:
        return {
          sortKey: 'RELEVANCE',
          reverse: false
        }
    }
  }

  /**
   * Extracts filter values from the URL query.
   * @param query - The URL query object containing potential filter values.
   * @returns An array of filters to apply to the collection.
   */
  const getFilterValuesFromUrl = (query: Record<string, any>): ProductFilter[] => {
    const filters: ProductFilter[] = []

    if (query.color) {
      const colorValues = query.color.split(',')
      colorValues.forEach(color => {
        filters.push({
          variantOption: {
            name: 'Color',
            value: color
          }
        })
      })
    }

    if (query.size) {
      const sizeValues = query.size.split(',')
      sizeValues.forEach(size => {
        filters.push({
          variantOption: {
            name: 'Size',
            value: size
          }
        })
      })
    }

    if (query.productType) {
      const productTypeValues = query.productType.split(',')
      productTypeValues.forEach(productType => {
        filters.push({
          productType: productType
        })
      })
    }

    return filters
  }

  /**
   * Filters products with available variants that match the selected color and size options.
   * @param products - The array of products to filter.
   * @param filters - The filters extracted from the URL query.
   * @returns An array of products with at least one matching and available variant.
   */
  const filterProductsByAvailability = (products: ProductFragment[], filters: ProductFilter[]) => {
    return products.filter(product => {
      const variants = product.variants.edges.map(({ node }) => node)
      const colorOptionNames = ['Color', 'Colour']
      const sizeOptionNames = ['Size', 'Length']

      return variants.some(variant => {
        const colorMatch = filters.find(filter =>
          colorOptionNames.includes(filter.variantOption?.name || '')
        )
          ? variant.selectedOptions.some(
              option =>
                colorOptionNames.includes(option.name) &&
                filters.find(filter => filter.variantOption?.value === option.value)
            )
          : true

        const sizeMatch = filters.find(filter =>
          sizeOptionNames.includes(filter.variantOption?.name || '')
        )
          ? variant.selectedOptions.some(
              option =>
                sizeOptionNames.includes(option.name) &&
                filters.find(filter => filter.variantOption?.value === option.value)
            )
          : true

        const isAvailable = variant.availableForSale

        return colorMatch && sizeMatch && isAvailable
      })
    })
  }

  /**
   * Sorts an array of sizes, prioritizing letter sizes first, then number sizes.
   * @param sizes - The array of size strings to sort.
   * @returns The sorted array of sizes.
   */
  const sortLetterAndNumberSizes = (sizes: string[]) => {
    const letterSizes = ['One Size', 'OS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

    return sizes.sort((a, b) => {
      const indexA = letterSizes.indexOf(a)
      const indexB = letterSizes.indexOf(b)

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1

      const numA = parseFloat(a)
      const numB = parseFloat(b)

      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }

      return a.localeCompare(b)
    })
  }

  return {
    getCollectionSortValuesFromUrl,
    getSearchSortValuesFromUrl,
    getFilterValuesFromUrl,
    filterProductsByAvailability,
    sortLetterAndNumberSizes
  }
}
