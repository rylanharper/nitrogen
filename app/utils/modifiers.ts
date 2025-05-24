/**
 * Converts a string to a URL-friendly slug.
 * @param text - The input string to slugify
 * @returns The slugified string
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

/**
 * Converts a slug back to a normal string with spaces.
 * @param text - The slugified string
 * @returns The deslugified string
 */
export const deslugify = (text: string): string => {
  return text.toLowerCase().replace(/-/g, ' ')
}

/**
 * Converts a string to camelCase.
 * @param text - The input string
 * @returns The camelCased string
 */
export const camelCase = (text: string): string => {
  if (!text) return ''
  return text
    .trim()
    .replace(/[^\w\s-]/g, '')
    .split(/[-\s]/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

/**
 * Converts a string to PascalCase.
 * @param text - The input string
 * @returns The PascalCased string
 */
export const pascalCase = (text: string): string => {
  if (!text) return ''
  return text
    .trim()
    .replace(/[^\w\s-]/g, '')
    .split(/[-\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * Converts a string to snake_case.
 * @param text - The input string
 * @returns The snake_cased string
 */
export const snakeCase = (text: string): string => {
  if (!text) return ''
  return text
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

/**
 * Converts a string to kebab-case.
 * @param text - The input string
 * @returns The kebab-cased string
 */
export const kebabCase = (text: string): string => {
  if (!text) return ''
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

/**
 * Converts a string to Title Case.
 * @param text - The input string
 * @returns The title-cased string
 */
export const titleCase = (text: string): string => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase()
    })
    .replace(/\s+/g, ' ')
}
