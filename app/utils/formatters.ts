/**
 * Formats a date according to the specified locale.
 * @param locale - The locale code, (e.g., 'en-US')
 * @param d - The date to format, either as a Date object or a string
 * @returns The formatted date string
 */
export const formatDateByLocale = (locale: string, d: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return new Date(d).toLocaleDateString(locale, options);
};

/**
 * Formats an image URL to include a specified width.
 * @param src - The original image URL
 * @param width - The desired width to include in the URL
 * @returns The formatted image URL or an empty string if undefined
 */
export const formatSizeUrl = (src: string | undefined, width: number): string => {
  if (!src) return '';

  const url = new URL(src);
  url.searchParams.set('width', String(width));

  return url.href;
};

/**
 * Formats a number as a currency string.
 * @param amount - The number (or string) to format
 * @param currencyCode - The currency code, (e.g., 'USD')
 * @param locale - The locale code, (e.g., 'en-US')
 * @returns The formatted currency string
 */
export const formatCurrency = (amount: string | number, currencyCode: string = 'USD', locale: string = 'en-US'): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  })
    .format(numericAmount)
    .replace(/\.00/g, '');
};

/**
 * Formats a Shopify variant ID to its numeric form.
 * @param gid - The variant ID (e.g., 'gid://shopify/ProductVariant/44284874064058')
 * @returns The numeric portion of the ID (e.g., '44284874064058')
 */
export const formatVariantId = (gid: string): string => {
  return gid.split('/').pop() ?? '';
};
