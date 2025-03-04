/**
 * Handles requests to the Klaviyo API through an API proxy.
 * @param event - The H3 event containing the request data
 * @returns The response from the Klaviyo API
 * @see https://developers.klaviyo.com/en/reference/api_overview
 */
export default defineEventHandler(async (event) => {
  const { klaviyo: options } = useRuntimeConfig(event);
  const body = await readBody(event);
  const type = body.data.type;

  let endpoint = '';

  switch (type) {
    case 'subscription':
      endpoint = `https://a.klaviyo.com/client/subscriptions/?company_id=${options.publicApiKey}`;
      break;
    case 'back-in-stock-subscription':
      endpoint = `https://a.klaviyo.com/client/back-in-stock-subscriptions/?company_id=${options.publicApiKey}`;
      break;
    default:
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid type specified.'
      });
  }

  return await $fetch(endpoint, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      revision: options.apiVersion,
      'content-type': 'application/json',
      Authorization: `Klaviyo-API-Key ${options.privateApiKey}`
    },
    body: JSON.stringify(body)
  });
});
