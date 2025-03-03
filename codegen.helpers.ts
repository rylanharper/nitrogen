/**
 * Meant to be used with GraphQL CodeGen to type the Storefront API's custom scalars correctly.
 * Reference for the GraphQL types: https://shopify.dev/docs/api/storefront/2024-07/scalars/HTML
 * Note: JSON is generated as 'unknown' by default
 */
export const storefrontApiCustomScalars = {
  Color: 'string',
  DateTime: 'string',
  Decimal: 'string',
  HTML: 'string',
  ISO8601DateTime: 'string',
  UnsignedInt64: 'string',
  URL: 'string'
};

/**
 * Meant to be used with GraphQL CodeGen to type the Customer Account API's custom scalars correctly.
 * Reference for the GraphQL types: https://shopify.dev/docs/api/customer/2024-07/scalars/HTML
 * Note: JSON is generated as 'unknown' by default
 */
export const customerAccountApiCustomScalars = {
  DateTime: 'string',
  Decimal: 'string',
  HTML: 'string',
  ISO8601DateTime: 'string',
  UnsignedInt64: 'string',
  URL: 'string'
};
