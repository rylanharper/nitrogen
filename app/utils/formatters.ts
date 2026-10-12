/**
 * Formats a date for a locale.
 * @param locale - The locale code (e.g., 'en-US')
 * @param d - The date to format
 */
export const formatDateByLocale = (locale: string, d: Date | string): string => {
  return new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'numeric', day: 'numeric' })
}

/**
 * Sets the `width` param on an image URL.
 * @param src - The image URL
 * @param width - The desired width
 * @returns The new URL, or an empty string if `src` is undefined
 */
export const formatImageUrl = (src: string | undefined, width: number): string => {
  if (!src) return ''

  const url = new URL(src)
  url.searchParams.set('width', String(width))

  return url.href
}

/**
 * Formats an amount as currency, dropping `.00`.
 * @param amount - The amount to format
 * @param currencyCode - The currency code (e.g., 'USD')
 * @param locale - The locale code (e.g., 'en-US')
 */
export const formatCurrency = (amount: string | number, currencyCode: string = 'USD', locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  })
    .format(Number(amount))
    .replace(/\.00/g, '')
}
