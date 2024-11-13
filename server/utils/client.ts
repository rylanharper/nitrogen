import type { DocumentNode } from 'graphql';

import { print } from 'graphql';

/**
 * Sends a GraphQL query to the Shopify API via the API proxy.
 * @param query - The GraphQL query as a DocumentNode
 * @param variables - Optional variables for the GraphQL query
 * @returns The response from the Shopify API
 */
export const query = (query: DocumentNode, variables = {}) => {
  const serializedQuery = print(query);

  return $fetch('/api/shopify', {
    method: 'POST',
    body: { query: serializedQuery, variables },
  });
};
