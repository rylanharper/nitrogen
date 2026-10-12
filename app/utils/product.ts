import type {
  MoneyFragment,
  VideoFragment,
  MediaImageFragment,
} from '#shopify/storefront'

/**
 * Checks if a product was created within the last `daysOld` days.
 * @param date - The product creation date
 * @param daysOld - Days a product counts as new (default: 30)
 */
export const isNewItem = (date: string, daysOld = 30): boolean => {
  const dayInMs = 24 * 60 * 60 * 1000
  return new Date(date).getTime() > Date.now() - daysOld * dayInMs
}

/**
 * Checks if a product is sold out.
 * @param availableForSale - The product's availability flag
 */
export const isSoldOut = (availableForSale: boolean): boolean => !availableForSale

/**
 * Checks if the compare-at price is higher than the current price.
 * @param price - The current price
 * @param compareAtPrice - The original price
 */
export const isOnSale = (price: MoneyFragment, compareAtPrice: MoneyFragment): boolean => {
  if (!price?.amount || !compareAtPrice?.amount) return false
  if (price.currencyCode !== compareAtPrice.currencyCode) return false
  return Number.parseFloat(compareAtPrice.amount) > Number.parseFloat(price.amount)
}

/**
 * Checks if a media item is a video.
 * @param media - The media item
 */
export const isMediaVideo = (media: any): media is VideoFragment => {
  return media?.mediaContentType === 'VIDEO'
}

/**
 * Checks if a media item is an image.
 * @param media - The media item
 */
export const isMediaImage = (media: any): media is MediaImageFragment => {
  return media?.mediaContentType === 'IMAGE'
}
