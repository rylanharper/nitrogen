/**
 * Handles requests to the Shopify GraphQL API through an API proxy.
 * @param event - The H3 event containing the request data
 * @returns The response from the Shopify GraphQL API
 */
export default defineEventHandler(async (event) => {
  const { shopify: options } = useRuntimeConfig();
  const { query, variables } = await readBody(event);

  return await $fetch(
    `${options.storefront}/api/${options.apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': options.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    }
  );
});
