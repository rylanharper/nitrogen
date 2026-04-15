import type {
  CartQuery,
  CartQueryVariables,
  CartCreateMutation,
  CartCreateMutationVariables,
  CartLinesAddMutation,
  CartLinesAddMutationVariables,
  CartLinesRemoveMutation,
  CartLinesRemoveMutationVariables,
  CartLinesUpdateMutation,
  CartLinesUpdateMutationVariables,
  CartBuyerIdentityUpdateMutation,
  CartBuyerIdentityUpdateMutationVariables,
} from '@@/types/shopify-storefront'

import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_LINES_UPDATE,
  CART_BUYER_IDENTITY_UPDATE,
} from '../graphql/storefront/mutations/cart'
import { CART } from '../graphql/storefront/queries/cart'
import { query } from '../graphql-client'

/**
 * Fetches the cart data.
 * @param variables - The variables for the cart query (cart ID)
 * @returns A Promise resolving to the cart data
 * @see https://shopify.dev/docs/api/storefront/latest/queries/cart
 */
const get = async (variables: CartQueryVariables) => {
  const { data } = await query<{ data: CartQuery }>(CART, variables)
  return data?.cart
}

/**
 * Creates a new cart.
 * @param variables - The variables for the cart creation mutation (input details)
 * @returns A Promise resolving to the created cart
 * @see https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate
 */
const create = async (variables: CartCreateMutationVariables) => {
  const { data } = await query<{ data: CartCreateMutation }>(CART_CREATE, variables)
  return data?.cartCreate
}

/**
 * Adds line items to the cart.
 * @param variables - The variables for the cart lines add mutation (cart ID, lines)
 * @returns A Promise resolving to the updated cart after adding lines
 * @see https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesAdd
 */
const addLines = async (variables: CartLinesAddMutationVariables) => {
  const { data } = await query<{ data: CartLinesAddMutation }>(CART_LINES_ADD, variables)
  return data?.cartLinesAdd
}

/**
 * Removes line items from the cart.
 * @param variables - The variables for the cart lines remove mutation (cart ID, line IDs)
 * @returns A Promise resolving to the updated cart after removing lines
 * @see https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesRemove
 */
const removeLines = async (variables: CartLinesRemoveMutationVariables) => {
  const { data } = await query<{ data: CartLinesRemoveMutation }>(CART_LINES_REMOVE, variables)
  return data?.cartLinesRemove
}

/**
 * Updates line items in the cart.
 * @param variables - The variables for the cart lines update mutation (cart ID, lines)
 * @returns A Promise resolving to the updated cart after updating lines
 * @see https://shopify.dev/docs/api/storefront/latest/mutations/cartLinesUpdate
 */
const updateLines = async (variables: CartLinesUpdateMutationVariables) => {
  const { data } = await query<{ data: CartLinesUpdateMutation }>(CART_LINES_UPDATE, variables)
  return data?.cartLinesUpdate
}

/**
 * Updates the buyer's identity in the cart.
 * @param variables - The variables for the cart buyer identity update mutation (cart ID, buyer identity)
 * @returns A Promise resolving to the updated cart with the new buyer identity
 * @see https://shopify.dev/docs/api/storefront/latest/mutations/cartBuyerIdentityUpdate
 */
const updateBuyerIdentity = async (variables: CartBuyerIdentityUpdateMutationVariables) => {
  const { data } = await query<{ data: CartBuyerIdentityUpdateMutation }>(CART_BUYER_IDENTITY_UPDATE, variables)
  return data?.cartBuyerIdentityUpdate
}

export const cart = {
  get,
  create,
  addLines,
  removeLines,
  updateLines,
  updateBuyerIdentity,
}
