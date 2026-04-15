/**
 * Handles product pagination driven by the `limit` URL query.
 * @param limit - The number of products to load per page
 * @returns The current items per page and a load more action
 */
export const usePagination = (limit = 12) => {
  const route = useRoute()
  const router = useRouter()

  // State
  const itemsPerPage = ref(Number(route.query.limit) || limit)

  // Actions
  const loadMoreProducts = () => {
    itemsPerPage.value += limit
    router.replace({ query: { ...route.query, limit: itemsPerPage.value } })
  }

  return { itemsPerPage, loadMoreProducts }
}
