/**
 * Meant to be used with GraphQL CodeGen to type the Admin API's custom scalars correctly.
 * Reference for the GraphQL types: https://shopify.dev/docs/api/admin-graphql/2025-01/scalars/arn
 * Note: JSON is generated as 'unknown' by default
 */
export const adminApiCustomScalars = {
  Color: 'string',
  Date: 'string',
  DateTime: 'string',
  Decimal: 'string',
  HTML: 'string',
  ID: 'string',
  ISO8601DateTime: 'string',
  Money: 'string',
  StorefrontID: 'string',
  UnsignedInt64: 'string',
  URL: 'string',
}

/**
 * Meant to be used with GraphQL CodeGen to type the Storefront API's custom scalars correctly.
 * Reference for the GraphQL types: https://shopify.dev/docs/api/storefront/2025-01/scalars/HTML
 * Note: JSON is generated as 'unknown' by default
 */
export const storefrontApiCustomScalars = {
  Color: 'string',
  DateTime: 'string',
  Decimal: 'string',
  HTML: 'string',
  ID: 'string',
  ISO8601DateTime: 'string',
  UnsignedInt64: 'string',
  URL: 'string',
}
