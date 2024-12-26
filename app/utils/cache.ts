/**
 * Creates cached `useAsyncData` with a specified expiration time..
 * @param expirationTime - The expiration time in minutes
 * @returns An object with transform and getCachedData methods for use in caching
 */
export const createCacheData = (expirationTime: number) => {
  return {
    transform(payload: any) {
      // Add a timestamp to the payload
      return {
        ...payload,
        fetchedAt: new Date().toISOString()
      };
    },
    getCachedData(key: string) {
      const nuxtApp = useNuxtApp();
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];

      // If no cached data is found, trigger a fetch
      if (!data) {
        return null;
      }

      // Check expiration
      const expiration = new Date(data.fetchedAt);
      expiration.setTime(expiration.getTime() + expirationTime * 60 * 1000);

      if (Date.now() > expiration.getTime()) {
        return null;
      }

      // Return valid cached data
      return data;
    }
  };
}
