/**
 * Checks if a given value is a valid email address.
 * @param value - The value to check
 * @returns A boolean indicating whether the value is a valid email address
 */
export function isEmail(value: string): boolean {
  const regex = /^(?!.*[._+-]{2})(?!.*[._+-]$)[a-zA-Z0-9._+-]+(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(value);
};

/**
 * Checks if a given option name corresponds to a size option.
 * @param name - The option name to check
 * @returns A boolean indicating whether the name is a size option
 */
export function isSizeOption(name: string): boolean {
  const sizeOptions = ['Size', 'Length'];
  return sizeOptions.includes(name);
}

/**
 * Checks if a given option name corresponds to a color option.
 * @param name - The option name to check
 * @returns A boolean indicating whether the name is a color option
 */
export function isColorOption(name: string): boolean {
  const colorOptions = ['Color', 'Colour'];
  return colorOptions.includes(name);
}

/**
 * Checks if a given value is an object.
 * @param value - The value to check
 * @returns A boolean indicating whether the value is an object
 */
export function isObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  return value.constructor === Object;
};

/**
 * Checks if a given value is an array.
 * @param value - The value to check, which should be an array of strings or numbers
 * @returns A boolean indicating whether the value is an array
 */
export function isArray(value: string[] | number[]): boolean {
  return Array.isArray(value);
};
