/**
 * Handles server requests to the Klaviyo API.
 * @param event - The H3 event containing the request data
 * @returns The response from the Klaviyo API
 * @see https://developers.klaviyo.com/en/reference/api_overview
 */
export default defineEventHandler(async (event) => {
  const { klaviyo: options } = useRuntimeConfig(event)
  const body = await readBody(event)
  const type = body?.data?.type

  let path = ''

  switch (type) {
    case 'subscription':
      path = 'subscriptions'
      break
    case 'back-in-stock-subscription':
      path = 'back-in-stock-subscriptions'
      break
    default:
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid data type specified.',
      })
  }

  const endpoint = `https://a.klaviyo.com/client/${path}/?company_id=${options.publicApiKey}`

  return $fetch(endpoint, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'revision': options.apiVersion,
      'content-type': 'application/json',
      'Authorization': `Klaviyo-API-Key ${options.privateApiKey}`,
    },
    body,
  })
})
