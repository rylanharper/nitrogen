import type { FilterFragment, ProductFilter } from '#shopify/storefront'
import type { LocationQueryValue } from 'vue-router'

/**
 * Normalizes a URL query filter value to an array of IDs.
 * @param filter - The raw query value
 */
export const normalizeFilterQuery = (filter: LocationQueryValue | LocationQueryValue[] | undefined): string[] =>
  (Array.isArray(filter) ? filter : filter ? [filter] : []).filter(Boolean) as string[]

/**
 * Resolves the `filter` URL param to product filters.
 * @param query - The URL query object
 * @param filterFragments - Filter fragments used to resolve filter IDs to inputs
 */
export const getFilterValues = (query: Record<string, any>, filterFragments?: FilterFragment[]) => {
  const filterIds = normalizeFilterQuery(query.filter)

  if (!filterIds.length || !filterFragments) return []

  const values = filterFragments.flatMap((fragment) => fragment.values ?? [])
  const filters: ProductFilter[] = [{ available: true }]

  for (const id of filterIds) {
    const match = values.find((value) => value.id === id)
    if (match) filters.push(JSON.parse(match.input))
  }

  return filters
}
