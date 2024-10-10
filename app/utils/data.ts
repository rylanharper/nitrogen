/**
 * Fetches graphql data using `useAsyncData` and the provided function and variables.
 * @param key - A unique key to ensure data is de-duplicated across requests
 * @param vars - Computed variables to pass into the fetch function
 * @param fetchFn - The function used to fetch data (gql operation)
 * @returns An object containing data, error, and refresh
 * @see https://nuxt.com/docs/api/composables/use-async-data
 */
export const fetchData = async <T, V>(key: string, vars: ComputedRef<V>, fetchFn: (vars: V) => Promise<T>) => {
  const { data, error, refresh } = await useAsyncData(key, () =>
    fetchFn(vars.value), {
      watch: [vars]
    }
  );

  if (error.value) {
    console.error(`Error fetching ${key} data`, error.value);
  }

  return { data, error, refresh };
};
