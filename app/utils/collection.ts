import type { ProductCollectionSortKeys, SearchSortKeys } from '#shopify/storefront'

/**
 * Maps the `sort` URL param to collection sort values.
 * @param sortParam - The sort URL parameter
 */
export const getCollectionSortValues = (sortParam: string | null): {
  sortKey: ProductCollectionSortKeys
  reverse: boolean
} => {
  switch (sortParam) {
    case 'price-high-low':
      return { sortKey: 'PRICE', reverse: true }
    case 'price-low-high':
      return { sortKey: 'PRICE', reverse: false }
    case 'best-selling':
      return { sortKey: 'BEST_SELLING', reverse: false }
    default:
      return { sortKey: 'CREATED', reverse: true }
  }
}

/**
 * Maps the `sort` URL param to search sort values.
 * @param sortParam - The sort URL parameter
 */
export const getSearchSortValues = (sortParam: string | null): {
  sortKey: SearchSortKeys
  reverse: boolean
} => {
  switch (sortParam) {
    case 'price-high-low':
      return { sortKey: 'PRICE', reverse: true }
    case 'price-low-high':
      return { sortKey: 'PRICE', reverse: false }
    default:
      return { sortKey: 'RELEVANCE', reverse: false }
  }
}
