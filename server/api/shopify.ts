/**
 * Handles requests to the Shopify GraphQL API through an API proxy.
 * @param event - The H3 event containing the request data
 * @returns The response from the Shopify GraphQL API
 * @see https://shopify.dev/docs/api/storefront
 */
export default defineEventHandler(async (event) => {
  const { shopify: options } = useRuntimeConfig();
  const { query, variables } = await readBody(event);

  const endpoint = `${options.storefront}/api/${options.apiVersion}/graphql.json`;

  try {
    return await $fetch(endpoint, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-Shopify-Storefront-Access-Token': options.accessToken,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to communicate with the Shopify API.'
    });
  }
});
