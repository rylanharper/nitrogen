/**
 * Handles server requests to the Shopify GraphQL Storefront API.
 * @param event - The H3 event containing the request data
 * @returns The response from the Shopify API
 * @see https://shopify.dev/docs/api/storefront
 */
export default defineEventHandler(async (event) => {
  const { shopify: options } = useRuntimeConfig(event)
  const { query, variables } = await readBody(event)

  const endpoint = `https://${options.domain}/api/${options.apiVersion}/graphql.json`

  return await $fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': options.storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  })
})
