import type { FilterFragment } from '#shopify/storefront'
import type { LocationQuery } from 'vue-router'

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
    const values = toValue(fragments)?.flatMap((fragment) => fragment.values ?? [])
    return values?.find((value) => value.id === id)?.label ?? id
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
      delete query.sort
    } else {
      const newFilters = normalizeFilterQuery(query.filter).filter((itemId) => itemId !== id)

      if (newFilters.length) query.filter = newFilters
      else delete query.filter
    }

    router.replace({ query })
  }

  return {
    activeFilterOptions,
    removeActiveFilterOption,
  }
}
