import { defineStore } from 'pinia';
import { useShopify } from '@/composables/use-shopify';

// Types
import type {
  CustomerQuery,
  CustomerQueryVariables,
  CustomerAccessTokenCreateInput,
  CustomerCreateInput
} from '@@/types/shopify';

// Interface
interface AuthState {
  accessToken: CustomerQueryVariables['customerAccessToken'];
  customer: CustomerQuery['customer'] | null;
}

// Composables
const shopify = useShopify();

// Store
export const useAuthStore = defineStore('@yeren/auth', {
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

        if (response?.customerAccessToken) {
          this.accessToken = response.customerAccessToken.accessToken;

          const customerResponse = await shopify.customer.get({
            customerAccessToken: this.accessToken
          });

          if (customerResponse) {
            this.customer = customerResponse;
          }
        }
      } catch (error) {
        console.error('Cannot create customer token', error);
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

        if (response?.customer) {
          await this.createToken({
            email: input.email,
            password: input.password
          });
        }
      } catch (error) {
        console.error('Cannot create new customer', error);
      }
    },
    /**
     * Logs in the customer, creates a new customer access token.
     * @param email - The customer's email
     * @param password - The customer's password
     */
    async login(email: string, password: string) {
      try {
        await this.createToken({
          email: email,
          password: password
        });
      } catch (error) {
        console.error('Cannot login customer', error);
      }
    },
    /**
     * Logs out the customer, deletes the customer access token.
     */
    async logout() {
      try {
        const response = await shopify.customer.deleteAccessToken({
          customerAccessToken: this.accessToken
        });

        if (response?.deletedAccessToken) {
          this.accessToken = '';
          this.customer = null;
        }
      } catch (error) {
        console.error('Cannot logout customer', error);
      }
    },
    /**
     * Sends a reset password email to the customer.
     * @param email - The customer's email
     */
    async recover(email: string) {
      try {
        await shopify.customer.recover({
          email: email
        });
      } catch (error) {
        console.error('Cannot reccover password', error);
      }
    },
    /**
     * Resets a customer’s password with the reset password URL.
     * @param password - The new password
     * @param resetUrl - The reset password URL
     */
    async reset(password: string, resetUrl: any) {
      try {
        const response = await shopify.customer.resetByUrl({
          password: password,
          resetUrl: resetUrl
        });

        if (response?.customerAccessToken) {
          this.accessToken = response.customerAccessToken.accessToken;
        }
      } catch (error) {
        console.error('Cannot reset password', error);
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentToken: (state) => state.accessToken ?? ''
  },

  persist: {
    paths: ['accessToken', 'customer']
  }
});
