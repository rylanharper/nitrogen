export interface KlaviyoError {
  id: string
  code: string
  title: string
  detail: string
  source?: {
    pointer?: string
    parameter?: string
  }
}

export interface KlaviyoResponse<T = unknown> {
  data?: T
  errors?: KlaviyoError[]
}

const profile = (email: string) => ({
  data: { type: 'profile' as const, attributes: { email } },
})

const relationship = <T extends string>(type: T, id: string) => ({
  data: { type, id },
})

const klaviyoPost = (body: Record<string, unknown>): Promise<KlaviyoResponse> =>
  $fetch('/api/klaviyo', { method: 'POST', body })

/**
 * Subscribes a user to a specified email list.
 * @param email - The user's email address
 * @param listId - The email list ID (newsletter)
 * @returns The subscription data response
 * @see https://developers.klaviyo.com/en/reference/create_client_subscription
 */
const newsletter = (email: string, listId: string) =>
  klaviyoPost({
    data: {
      type: 'subscription',
      attributes: {
        profile: profile(email),
      },
      relationships: {
        list: relationship('list', listId),
      },
    },
  })

/**
 * Subscribes a user to back-in-stock notifications.
 * @param email - The user's email address
 * @param variantId - The selected product variant ID
 * @returns The back-in-stock-subscription data response
 * @see https://developers.klaviyo.com/en/reference/create_client_back_in_stock_subscription
 */
const backInStock = (email: string, variantId: string) =>
  klaviyoPost({
    data: {
      type: 'back-in-stock-subscription',
      attributes: {
        channels: ['EMAIL'],
        profile: profile(email),
      },
      relationships: {
        variant: relationship('catalog-variant', `$shopify:::$default:::${variantId}`),
      },
    },
  })

export const subscribe = {
  newsletter,
  backInStock,
}
