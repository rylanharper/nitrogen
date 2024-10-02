import type { ProductFragment, MoneyFragment, ProductOptionFragment } from '@@/types/shopify'

export function useProductHelpers() {
  const isNewItem = (date: string, daysOld = 30) => {
    return (
      new Date(date).valueOf() >
      new Date().setDate(new Date().getDate() - daysOld).valueOf()
    )
  }

  const isSoldOut = (product: ProductFragment) => {
    return !product.availableForSale
  }

  const isOnSale = (price: MoneyFragment, compareAtPrice: MoneyFragment) => {
    if (compareAtPrice.amount > price.amount) {
      return true
    }
    return false
  }

  const getColorOption = (optionInput: ProductOptionFragment[]) => {
    const colorOptionNames = ['Color', 'Colour']
    return optionInput.find((option) => colorOptionNames.includes(option.name)) ?? null
  }

  const getSizeOption = (optionInput: ProductOptionFragment[]) => {
    const sizeOptionNames = ['Size', 'Length']
    return optionInput.find((option) => sizeOptionNames.includes(option.name)) ?? null
  }

  return {
    isNewItem,
    isSoldOut,
    isOnSale,
    getColorOption,
    getSizeOption
  }
}
