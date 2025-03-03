/**
 * Checks if a given value is a valid email address.
 * @param value - The value to check
 * @returns A boolean indicating whether the value is a valid email address
 */
export const isEmail = (value: string): boolean => {
  const regex = /^(?!.*[._+-]{2})(?!.*[._+-]$)[a-zA-Z0-9._+-]+(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(value);
};

/**
 * Checks if a given value is an object.
 * @param value - The value to check
 * @returns A boolean indicating whether the value is an object
 */
export const isObject = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) return false;
  return value.constructor === Object;
};

/**
 * Checks if a given value is an array.
 * @param value - The value to check, which should be an array of strings or numbers
 * @returns A boolean indicating whether the value is an array
 */
export const isArray = (value: string[] | number[]): boolean => {
  return Array.isArray(value);
};
