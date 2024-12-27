import type {
  CustomerQuery,
  CustomerQueryVariables,
  CustomerAccessTokenCreateInput,
  CustomerCreateInput
} from '@@/types/shopify';

import { defineStore } from 'pinia';

// Interface
interface AuthState {
  accessToken: CustomerQueryVariables['customerAccessToken'];
  customer: CustomerQuery['customer'] | null;
}

// Composables
const shopify = useShopify();

// Store
export const useAuthStore = defineStore('@nitrogen/auth', {
  state: (): AuthState => ({
    accessToken: '',
    customer: null
  }),

  actions: {
    /**
     * Creates a customer access token.
     * @param input - The input data for creating the token
     */
    async createToken(input: CustomerAccessTokenCreateInput) {
      try {
        const response = await shopify.customer.createAccessToken({
          input: input
        });

        if (response?.customerUserErrors?.length) {
          throw new Error(response?.customerUserErrors[0]?.message);
        }

        if (response?.customerAccessToken) {
          this.accessToken = response.customerAccessToken.accessToken;
          await this.getCustomer();
        }
      } catch (error: any) {
        console.error('Cannot create customer access token:', error.message);
        throw error;
      }
    },
    /**
     * Fetches the customer data using the stored access token.
     */
    async getCustomer() {
      try {
        const response = await shopify.customer.get({
          customerAccessToken: this.accessToken
        });

        if (!response) {
          throw new Error('No customer data found.');
        }

        const customerInfo = {
          id: response.id,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName
          // Add more if needed...
        };

        this.customer = customerInfo;
      } catch (error: any) {
        console.error('Cannot get customer data:', error.message);
        throw error;
      }
    },
    /**
     * Creates a new customer.
     * @param input - The input data for creating the customer
     */
    async createCustomer(input: CustomerCreateInput) {
      try {
        const response = await shopify.customer.create({
          input: input
        });

        if (!response?.customer?.id) {
          throw new Error(response?.customerUserErrors[0]?.message);
        }

        if (response?.customer) {
          await this.createToken({
            email: input.email,
            password: input.password
          });
        }
      } catch (error: any) {
        console.error('Cannot create new customer:', error.message);
        throw error;
      }
    },
    /**
     * Logs in the customer, creates a new customer access token.
     * @param email - The customer's email
     * @param password - The customer's password
     */
    async login(email: string, password: string) {
      await this.createToken({
        email: email,
        password: password
      });
    },
    /**
     * Logs out the customer, deletes the customer access token.
     */
    async logout() {
      try {
        const response = await shopify.customer.deleteAccessToken({
          customerAccessToken: this.accessToken
        });

        if (response?.userErrors?.length) {
          throw new Error(response?.userErrors[0]?.message);
        }

        if (response?.deletedAccessToken) {
          this.accessToken = '';
          this.customer = null;
        }
      } catch (error: any) {
        console.error('Cannot delete access token:', error.message);
        throw error;
      }
    },
    /**
     * Sends a reset password email to the customer.
     * @param email - The customer's email
     */
    async recover(email: string) {
      try {
        const response = await shopify.customer.recover({
          email: email
        });

        if (response?.customerUserErrors?.length) {
          throw new Error(response?.customerUserErrors[0]?.message);
        }

        return response;
      } catch (error: any) {
        console.error('Cannot recover customer password:', error.message);
        throw error;
      }
    },
    /**
     * Resets a customer's password using their ID, new password, and reset token.
     * @param id - The customer's ID
     * @param password - The new password
     * @param resetToken - The reset token from the URL
     */
    async reset(id: string, password: string, resetToken: string) {
      try {
        const response = await shopify.customer.reset({
          id: `gid://shopify/Customer/${id}`,
          input: {
            password,
            resetToken
          }
        });

        if (response?.customerUserErrors?.length) {
          throw new Error(response?.customerUserErrors[0]?.message);
        }

        if (response?.customerAccessToken) {
          this.accessToken = response.customerAccessToken.accessToken;
          await this.getCustomer();
        }
      } catch (error: any) {
        console.error('Cannot reset customer password:', error.message);
        throw error;
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentToken: (state) => state.accessToken ?? ''
  },

  persist: {
    pick: ['accessToken', 'customer']
  }
});
