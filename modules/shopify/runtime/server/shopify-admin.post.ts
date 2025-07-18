/**
 * Handles server requests to the Shopify GraphQL Admin API.
 * @param event - The H3 event containing the request data
 * @returns The response from the Shopify API
 * @see https://shopify.dev/docs/api/admin-graphql
 */
export default defineEventHandler(async (event) => {
  const { shopify: options } = useRuntimeConfig(event)
  const { query, variables } = await readBody(event)

  const endpoint = `https://${options.domain}/admin/api/${options.apiVersion}/graphql.json`

  return await $fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': options.adminAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  })
})
