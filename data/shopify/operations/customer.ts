import type {
  CustomerUpdateMutation,
  CustomerUpdateMutationVariables,
} from '@@/types/shopify-admin'

import type {
  CustomerQuery,
  CustomerQueryVariables,
  CustomerAccessTokenCreateMutation,
  CustomerAccessTokenCreateMutationVariables,
  CustomerAccessTokenDeleteMutation,
  CustomerAccessTokenDeleteMutationVariables,
  CustomerCreateMutation,
  CustomerCreateMutationVariables,
  CustomerRecoverMutation,
  CustomerRecoverMutationVariables,
  CustomerResetMutation,
  CustomerResetMutationVariables,
  CustomerResetByUrlMutation,
  CustomerResetByUrlMutationVariables,
  CustomerAddressCreateMutation,
  CustomerAddressCreateMutationVariables,
  CustomerAddressDeleteMutation,
  CustomerAddressDeleteMutationVariables,
  CustomerAddressUpdateMutation,
  CustomerAddressUpdateMutationVariables,
  CustomerDefaultAddressUpdateMutation,
  CustomerDefaultAddressUpdateMutationVariables,
} from '@@/types/shopify-storefront'

import { CUSTOMER_UPDATE_METAFIELDS } from '../graphql/admin/mutations/customer'
import {
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_CREATE,
  CUSTOMER_RECOVER,
  CUSTOMER_RESET,
  CUSTOMER_RESET_BY_URL,
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE,
} from '../graphql/storefront/mutations/customer'
import { CUSTOMER } from '../graphql/storefront/queries/customer'
import { query } from '../utils/graphql-client'

/**
 * Fetches the customer data.
 * @param options - The variables for the customer query (access token)
 * @returns A Promise resolving to the customer data
 * @see https://shopify.dev/docs/api/storefront/2025-01/queries/customer
 */
const get = async (
  options: CustomerQueryVariables,
): Promise<CustomerQuery['customer']> => {
  const response = await query(CUSTOMER, options)
  return response.data?.customer
}

/**
 * Creates a customer access token.
 * @param options - The variables for the customer access token mutation (email, password)
 * @returns A Promise resolving to the customer access token
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerAccessTokenCreate
 */
const createAccessToken = async (
  options: CustomerAccessTokenCreateMutationVariables,
): Promise<CustomerAccessTokenCreateMutation['customerAccessTokenCreate']> => {
  const response = await query(CUSTOMER_ACCESS_TOKEN_CREATE, options)
  return response.data?.customerAccessTokenCreate
}

/**
 * Deletes a customer access token.
 * @param options - The variables for the access token deletion (access token)
 * @returns A Promise resolving to the deletion status
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerAccessTokenDelete
 */
const deleteAccessToken = async (
  options: CustomerAccessTokenDeleteMutationVariables,
): Promise<CustomerAccessTokenDeleteMutation['customerAccessTokenDelete']> => {
  const response = await query(CUSTOMER_ACCESS_TOKEN_DELETE, options)
  return response.data?.customerAccessTokenDelete
}

/**
 * Creates a new customer account.
 * @param options - The variables for the customer creation mutation (email, password, etc.)
 * @returns A Promise resolving to the created customer data
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerCreate
 */
const create = async (
  options: CustomerCreateMutationVariables,
): Promise<CustomerCreateMutation['customerCreate']> => {
  const response = await query(CUSTOMER_CREATE, options)
  return response.data?.customerCreate
}

/**
 * Sends a customer recovery email to reset their password.
 * @param options - The variables for the customer recovery mutation (email)
 * @returns A Promise resolving to the recovery status
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerRecover
 */
const recover = async (
  options: CustomerRecoverMutationVariables,
): Promise<CustomerRecoverMutation['customerRecover']> => {
  const response = await query(CUSTOMER_RECOVER, options)
  return response.data?.customerRecover
}

/**
 * Resets the customer's password.
 * @param options - The variables for the customer reset mutation (customer reset ID, password, reset token)
 * @returns A Promise resolving to the reset status
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerReset
 */
const reset = async (
  options: CustomerResetMutationVariables,
): Promise<CustomerResetMutation['customerReset']> => {
  const response = await query(CUSTOMER_RESET, options)
  return response.data?.customerReset
}

/**
 * Resets a customer's password using a reset URL.
 * @param options - The variables for the customer password reset by URL mutation (new password, reset URL)
 * @returns A Promise resolving to the password reset status
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerResetByUrl
 */
const resetByUrl = async (
  options: CustomerResetByUrlMutationVariables,
): Promise<CustomerResetByUrlMutation['customerResetByUrl']> => {
  const response = await query(CUSTOMER_RESET_BY_URL, options)
  return response.data?.customerResetByUrl
}

/**
 * Creates a new customer address.
 * @param options - The variables for the customer address creation mutation (address details, access token)
 * @returns A Promise resolving to the newly created customer address
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerAddressCreate
 */
const createAddress = async (
  options: CustomerAddressCreateMutationVariables,
): Promise<CustomerAddressCreateMutation['customerAddressCreate']> => {
  const response = await query(CUSTOMER_ADDRESS_CREATE, options)
  return response.data?.customerAddressCreate
}

/**
 * Deletes a customer address.
 * @param options - The variables for the customer address deletion mutation (access token, address ID)
 * @returns A Promise resolving to the deletion status
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerAddressDelete
 */
const deleteAddress = async (
  options: CustomerAddressDeleteMutationVariables,
): Promise<CustomerAddressDeleteMutation['customerAddressDelete']> => {
  const response = await query(CUSTOMER_ADDRESS_DELETE, options)
  return response.data?.customerAddressDelete
}

/**
 * Updates an existing customer address.
 * @param options - The variables for the customer address update mutation (new address details, access token, address ID)
 * @returns A Promise resolving to the updated customer address
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerAddressUpdate
 */
const updateAddress = async (
  options: CustomerAddressUpdateMutationVariables,
): Promise<CustomerAddressUpdateMutation['customerAddressUpdate']> => {
  const response = await query(CUSTOMER_ADDRESS_UPDATE, options)
  return response.data?.customerAddressUpdate
}

/**
 * Updates the customer's default address.
 * @param options - The variables for the customer default address update mutation (address ID, access token)
 * @returns A Promise resolving to the customer update status
 * @see https://shopify.dev/docs/api/storefront/2025-01/mutations/customerDefaultAddressUpdate
 */
const updateDefaultAddress = async (
  options: CustomerDefaultAddressUpdateMutationVariables,
): Promise<CustomerDefaultAddressUpdateMutation['customerDefaultAddressUpdate']> => {
  const response = await query(CUSTOMER_DEFAULT_ADDRESS_UPDATE, options)
  return response.data?.customerDefaultAddressUpdate
}

/**
 * Updates one or more metafields on the customer.
 * @param options - The variables for the customer update mutation, (customer ID, customer metafields)
 * @returns A Promise resolving to the customerUpdate payload
 * @see https://shopify.dev/docs/api/admin-graphql/2025-01/mutations/customerUpdate
 */
const updateMetafields = async (
  options: CustomerUpdateMutationVariables,
): Promise<CustomerUpdateMutation['customerUpdate']> => {
  const response = await query(CUSTOMER_UPDATE_METAFIELDS, options, 'admin')
  return response.data?.customerUpdate
}

export default {
  get,
  create,
  recover,
  reset,
  resetByUrl,
  createAccessToken,
  deleteAccessToken,
  createAddress,
  deleteAddress,
  updateAddress,
  updateDefaultAddress,
  updateMetafields,
}
