import type {
  ProductCollectionSortKeys,
  SearchSortKeys,
  ProductFilter,
  ProductFragment,
  MoneyFragment,
  ProductOptionFragment,
  ProductVariantFragment
} from '@@/types/shopify';

export const useShopifyHelpers = () => {
  /**
   * Extracts the collection sort values from the URL query.
   * @param sortParam - The sort URL parameter
   * @returns An object containing the sort and reverse key
   */
  const getCollectionSortValues = (sortParam: string | null): {
    sortKey: ProductCollectionSortKeys;
    reverse: boolean;
  } => {
    switch (sortParam) {
      case 'price-high-low':
        return {
          sortKey: 'PRICE',
          reverse: true
        };
      case 'price-low-high':
        return {
          sortKey: 'PRICE',
          reverse: false
        };
      case 'best-selling':
        return {
          sortKey: 'BEST_SELLING',
          reverse: false
        };
      case 'newest':
        return {
          sortKey: 'CREATED',
          reverse: true
        };
      default:
        return {
          sortKey: 'MANUAL',
          reverse: false
        };
    }
  };

  /**
   * Extracts the search sort values from the URL query.
   * @param sortParam - The sort URL parameter
   * @returns An object containing the sort and reverse key
   */
  const getSearchSortValues = (sortParam: string | null): {
    sortKey: SearchSortKeys;
    reverse: boolean;
  } => {
    switch (sortParam) {
      case 'price-high-low':
        return {
          sortKey: 'PRICE',
          reverse: true
        };
      case 'price-low-high':
        return {
          sortKey: 'PRICE',
          reverse: false
        };
      default:
        return {
          sortKey: 'RELEVANCE',
          reverse: false
        };
    }
  };

  /**
   * Extracts filter values from the URL query.
   * @param query - The URL query object containing potential filter values
   * @returns An array of filters to apply to the collection
   */
  const getFilterValues = (query: Record<string, any>) => {
    const filters: ProductFilter[] = [];

    if (query.color || query.size || query.productType) {
      filters.push({
        available: true
      });
    }

    if (query.color) {
      const colorValues = query.color.split(',');
      colorValues.forEach((color: any) => {
        filters.push({
          variantOption: {
            name: 'Color',
            value: color
          }
        });
      });
    }

    if (query.size) {
      const sizeValues = query.size.split(',');
      sizeValues.forEach((size: any) => {
        filters.push({
          variantOption: {
            name: 'Size',
            value: size
          }
        });
      });
    }

    if (query.productType) {
      const productTypeValues = query.productType.split(',');
      productTypeValues.forEach((productType: any) => {
        filters.push({
          productType: productType
        });
      });
    }

    return filters;
  };

  /**
   * Sorts an array of sizes, prioritizing letter sizes first, then number sizes.
   * @param sizes - The array of sizes to sort
   * @returns An array of sorted sizes
   */
  const sortSizeOptions = (sizes: string[]) => {
    const letterSizes = ['One Size', 'OS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const letterSizeMap = new Map(letterSizes.map((size, index) => [size, index]));

    return sizes.sort((a, b) => {
      const indexA = letterSizeMap.get(a);
      const indexB = letterSizeMap.get(b);

      if (indexA !== undefined && indexB !== undefined) {
        return indexA - indexB;
      }
      if (indexA !== undefined) return -1;
      if (indexB !== undefined) return 1;

      const numA = parseFloat(a);
      const numB = parseFloat(b);

      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }

      return a.localeCompare(b);
    });
  };

  /**
   * Checks if a product is considered new based on its creation date.
   * @param date - The creation date of the product
   * @param daysOld - Number of days to consider a product new (default: 30)
   * @returns A boolean indicating if the product is new
   */
  const isNewItem = (date: string, daysOld = 30): boolean => {
    return (
      new Date(date).valueOf() >
      new Date().setDate(new Date().getDate() - daysOld).valueOf()
    );
  };

  /**
   * Checks if a product is sold out based on its availability.
   * @param product - The product object containing availability information
   * @returns A boolean indicating if the product is sold out
   */
  const isSoldOut = (product: ProductFragment): boolean => {
    return !product.availableForSale;
  };

  /**
   * Determines if a product is on sale by comparing its current price to its original price.
   * @param price - The current price of the product
   * @param compareAtPrice - The original price of the product
   * @returns A boolean indicating if the product is on sale
   */
  const isOnSale = (price: MoneyFragment, compareAtPrice: MoneyFragment): boolean => {
    if (compareAtPrice.amount > price.amount) return true;
    return false;
  };

  /**
   * Finds the color option from a product's option list.
   * @param optionInput - Array of product options
   * @returns The color option if found, null otherwise
   */
  const getColorOption = (optionInput: ProductOptionFragment[]) => {
    const colorOptionNames = ['Color', 'Colour'];
    return optionInput.find((option) => colorOptionNames.includes(option.name)) ?? null;
  };

  /**
   * Finds the size option from a product's option list.
   * @param optionInput - Array of product options
   * @returns The size option if found, null otherwise
   */
  const getSizeOption = (optionInput: ProductOptionFragment[]) => {
    const sizeOptionNames = ['Size', 'Length'];
    return optionInput.find((option) => sizeOptionNames.includes(option.name)) ?? null;
  };

  /**
   * Checks if a specific size is sold out across all variants.
   * @param variants - Array of product variants
   * @param sizeValue - The size value to check
   * @returns A boolean indicating if the size is sold out
   */
  const isSizeSoldOut = (
    variants: ProductVariantFragment[],
    sizeValue: string
  ): boolean => {
    const sizeOptionNames = ['Size', 'Length'];
    const sizeVariants = variants.filter((variant) =>
      variant.selectedOptions.some((option) =>
        sizeOptionNames.includes(option.name) && option.value === sizeValue
      )
    );

    return sizeVariants.every((variant) => !variant.availableForSale);
  };

  /**
   * Checks if a specific color is sold out across all variants.
   * @param variants - Array of product variants
   * @param colorValue - The color value to check
   * @returns A boolean indicating if the color is sold out
   */
  const isColorSoldOut = (
    variants: ProductVariantFragment[],
    colorValue: string
  ): boolean => {
    const colorOptionNames = ['Color', 'Colour'];
    const colorVariants = variants.filter((variant) =>
      variant.selectedOptions.some((option) =>
        colorOptionNames.includes(option.name) && option.value === colorValue
      )
    );

    return colorVariants.every((variant) => !variant.availableForSale);
  };

  return {
    getCollectionSortValues,
    getSearchSortValues,
    getFilterValues,
    sortSizeOptions,
    isNewItem,
    isSoldOut,
    isOnSale,
    getColorOption,
    getSizeOption,
    isSizeSoldOut,
    isColorSoldOut
  };
};
