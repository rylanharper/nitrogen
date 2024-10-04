/**
 * Fetches data using `useAsyncData` and the provided function and variables.
 * @param vars - Computed variables to pass into the fetch function
 * @param key - A unique key to ensure that data can be properly de-duplicated
 * @param fetchFn - The function used to fetch data (graphql operations)
 * @returns An object containing data, error, and refresh
 * @see https://nuxt.com/docs/api/composables/use-async-data
 */
export const fetchData = async <T>(vars: ComputedRef<any>, key: string, fetchFn: (vars: any) => Promise<T>) => {
  const { data, error, refresh } = await useAsyncData(`${key}`, () =>
    fetchFn(vars.value), {
      watch: [vars]
    }
  );

  if (error.value) {
    console.error(`Error fetching ${key} data`, error.value);
  }

  return { data, error, refresh };
};
