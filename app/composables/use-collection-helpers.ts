import type {
  ProductCollectionSortKeys,
  SearchSortKeys,
  ProductFilter
} from '@@/types/shopify';

export const useCollectionHelpers = () => {
  /**
   * Extracts the collection sort values from the URL query.
   * @param sortParam - The sort parameter from the URL
   * @returns An object containing the sort key and whether the sort should be reversed
   */
  const getCollectionSortValuesFromUrl = (sortParam: string | null): {
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
   * @param sortParam - The sort parameter from the URL
   * @returns An object containing the sort key and whether the sort should be reversed
   */
  const getSearchSortValuesFromUrl = (sortParam: string | null): {
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
  const getFilterValuesFromUrl = (query: Record<string, any>): ProductFilter[] => {
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
   * @param sizes - The array of size strings to sort
   * @returns The sorted array of sizes
   */
  const sortLetterAndNumberSizes = (sizes: string[]): string[] => {
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

  return {
    getCollectionSortValuesFromUrl,
    getSearchSortValuesFromUrl,
    getFilterValuesFromUrl,
    sortLetterAndNumberSizes
  };
};
