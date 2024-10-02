/**
 * Creates a debounced function that delays execution until after a specified timeout.
 * @param func - The function to debounce
 * @param timeout - The delay in milliseconds (default is 300ms)
 * @returns A debounced version of the original function
 */
export const debounce = (func: any, timeout = 300) => {
  let timer: NodeJS.Timeout;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
