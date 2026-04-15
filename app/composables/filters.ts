import type { FilterFragment } from '@@/types/shopify-storefront'
import type { LocationQuery } from 'vue-router'

import { normalizeFilterQuery } from '~/helpers/shopify'

/**
 * Reads and removes the active URL filter fragments.
 * @param fragments - Filter fragments used to resolve filter IDs to labels
 * @returns The active filter options and a removal action
 */
export const useActiveFilters = (fragments?: MaybeRefOrGetter<FilterFragment[] | null | undefined>) => {
  const route = useRoute()
  const router = useRouter()

  // Find filter label from filter ID
  const findLabel = (id: string): string => {
    const resolved = toValue(fragments)
    if (!resolved) return id

    for (const filter of resolved) {
      const match = filter.values?.find((value: FilterFragment['values'][number]) => value.id === id)
      if (match) return match.label
    }

    return id
  }

  // Get the active URL filter fragments
  const activeFilterOptions = computed(() => {
    const { sort, filter } = route.query
    const options: Array<{ name: string, value: string, id: string }> = []

    if (sort) {
      options.push({ name: 'sort', value: sort as string, id: sort as string })
    }

    for (const id of normalizeFilterQuery(filter)) {
      options.push({ name: 'filter', value: findLabel(id), id })
    }

    return options
  })

  // Remove an active filter fragment from the URL
  const removeActiveFilterOption = (name: string, id: string) => {
    const query: LocationQuery = { ...route.query }

    if (name === 'sort') {
      query.sort = undefined as any
    } else {
      const newFilters = normalizeFilterQuery(query.filter).filter((itemId) => itemId !== id)
      query.filter = newFilters.length ? newFilters : undefined as any
    }

    router.replace({ query })
  }

  return {
    activeFilterOptions,
    removeActiveFilterOption,
  }
}
