import type { DocumentNode } from 'graphql';

import { print } from 'graphql';

/**
 * Sends a GraphQL query to the Shopify API via the API proxy.
 * @param query - The GraphQL query as a DocumentNode
 * @param variables - Optional variables for the GraphQL query
 * @param maxRetries - Maximum number of retries for the fetch request
 * @param waitTime - Wait time between fetch retries in milliseconds
 * @returns The response from the Shopify API
 */
export const query = async (
  query: DocumentNode,
  variables = {},
  maxRetries = 3,
  waitTime = 1000
) => {
  const serializedQuery = print(query);

  const fetchRequest = async (retryCount = 0): Promise<any> => {
    try {
      return await $fetch('/api/shopify', {
        method: 'POST',
        body: { query: serializedQuery, variables },
      });
    } catch (error: any) {
      const count = retryCount + 1;

      if (retryCount < maxRetries) {
        console.warn(`Retrying Storefront API fetch request (${count}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return fetchRequest(count);
      }

      throw createError({
        statusCode: 500,
        statusMessage: `GraphQL fetch request failed after ${maxRetries} attempts.`,
        data: { error: error.message }
      });
    }
  };

  return fetchRequest();
};
