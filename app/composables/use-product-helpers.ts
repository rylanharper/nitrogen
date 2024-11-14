import type {
  ProductFragment,
  MoneyFragment,
  ProductOptionFragment,
  ProductVariantFragment
} from '@@/types/shopify';

export const useProductHelpers = () => {
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
  const getColorOption = (optionInput: ProductOptionFragment[]): ProductOptionFragment | null => {
    const colorOptionNames = ['Color', 'Colour'];
    return optionInput.find((option) => colorOptionNames.includes(option.name)) ?? null;
  };

  /**
   * Finds the size option from a product's option list.
   * @param optionInput - Array of product options
   * @returns The size option if found, null otherwise
   */
  const getSizeOption = (optionInput: ProductOptionFragment[]): ProductOptionFragment | null => {
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
    isNewItem,
    isSoldOut,
    isOnSale,
    getColorOption,
    getSizeOption,
    isSizeSoldOut,
    isColorSoldOut
  };
};
