import type { H3Event } from 'h3'

/**
 * Handles requests to the Shopify GraphQL API through an API proxy.
 * @param event - The H3 event containing the request data
 * @returns The response from the Shopify GraphQL API
 */
export default defineEventHandler(async (event: H3Event) => {
  const { shopify: options } = useRuntimeConfig();
  const { query, variables } = await readBody(event);

  return await $fetch(
    `https://${options.shop}.myshopify.com/api/${options.version}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': options.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    }
  );
});
