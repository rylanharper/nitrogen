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
  CartBuyerIdentityUpdateMutationVariables
} from '@@/types/shopify';

import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_LINES_UPDATE,
  CART_BUYER_IDENTITY_UPDATE
} from '../graphql/mutations/cart';
import { CART } from '../graphql/queries/cart';
import { query } from '../utils/graphql-client';

/**
 * Fetches a cart based on the provided cart ID.
 * @param options - The variables for the cart query (cart ID)
 * @returns A Promise resolving to the cart data
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/cart
 */
const get = async (
  options: CartQueryVariables
): Promise<CartQuery['cart']> => {
  const response = await query(CART, options) as { data?: CartQuery };
  return response.data?.cart;
};

/**
 * Creates a new cart.
 * @param options - The variables for the cart creation mutation (input details)
 * @returns A Promise resolving to the created cart
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/cartCreate
 */
const create = async (
  options: CartCreateMutationVariables
): Promise<CartCreateMutation['cartCreate']> => {
  const response = await query(CART_CREATE, options) as { data?: CartCreateMutation };
  return response.data?.cartCreate;
};

/**
 * Adds line items to the cart.
 * @param options - The variables for the cart lines add mutation (cart ID, lines)
 * @returns A Promise resolving to the updated cart after adding lines
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/cartLinesAdd
 */
const addLines = async (
  options: CartLinesAddMutationVariables
): Promise<CartLinesAddMutation['cartLinesAdd']> => {
  const response = await query(CART_LINES_ADD, options) as { data?: CartLinesAddMutation };
  return response.data?.cartLinesAdd;
};

/**
 * Removes line items from the cart.
 * @param options - The variables for the cart lines remove mutation (cart ID, line IDs)
 * @returns A Promise resolving to the updated cart after removing lines
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/cartLinesRemove
 */
const removeLines = async (
  options: CartLinesRemoveMutationVariables
): Promise<CartLinesRemoveMutation['cartLinesRemove']> => {
  const response = await query(CART_LINES_REMOVE, options) as { data?: CartLinesRemoveMutation };
  return response.data?.cartLinesRemove;
};

/**
 * Updates line items in the cart.
 * @param options - The variables for the cart lines update mutation (cart ID, lines)
 * @returns A Promise resolving to the updated cart after updating lines
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/cartLinesUpdate
 */
const updateLines = async (
  options: CartLinesUpdateMutationVariables
): Promise<CartLinesUpdateMutation['cartLinesUpdate']> => {
  const response = await query(CART_LINES_UPDATE, options) as { data?: CartLinesUpdateMutation };
  return response.data?.cartLinesUpdate;
};

/**
 * Updates the buyer's identity in the cart.
 * @param options - The variables for the cart buyer identity update mutation (cart ID, buyer identity)
 * @returns A Promise resolving to the updated cart with the new buyer identity
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/cartBuyerIdentityUpdate
 */
const updateBuyerIdentity = async (
  options: CartBuyerIdentityUpdateMutationVariables
): Promise<CartBuyerIdentityUpdateMutation['cartBuyerIdentityUpdate']> => {
  const response = await query(CART_BUYER_IDENTITY_UPDATE, options) as { data?: CartBuyerIdentityUpdateMutation };
  return response.data?.cartBuyerIdentityUpdate;
};

export default {
  get,
  create,
  addLines,
  removeLines,
  updateLines,
  updateBuyerIdentity
};
