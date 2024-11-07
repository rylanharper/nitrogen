import { defineStore } from 'pinia';

// Types
import type {
  CountryCode,
  LanguageCode,
  CartQuery,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  CartBuyerIdentityInput
} from '@@/types/shopify';

type CartOptionalInput = {
  country?: CountryCode;
  language?: LanguageCode;
};

// Interface
interface CartState {
  cart: CartQuery['cart'] | null;
}

// Composables
const shopify = useShopify();

// Store
export const useCartStore = defineStore('@yeren/cart', {
  state: (): CartState => ({
    cart: null
  }),

  actions: {
    /**
     * Creates a new cart.
     * @param input - The cart input data
     * @param optionalParams - Optional cart parameters such as country and language
     */
    async createCart(input?: CartInput, optionalParams?: CartOptionalInput) {
      try {
        const response = await shopify.cart.create({
          input: input,
          ...optionalParams
        });

        if (response?.cart) {
          this.cart = response.cart;
        }
      } catch (error) {
        console.error('No cart returned from cartCreate mutation', error);
      }
    },
    /**
     * Retrieves the cart.
     * @param optionalParams - Optional cart parameters such as country and language
     */
    async getCart(optionalParams?: CartOptionalInput) {
      if (!this.cart?.id) {
        await this.createCart();
        return;
      }

      try {
        const response = await shopify.cart.get({
          id: this.cart.id,
          ...optionalParams
        });

        if (response) {
          this.cart = response;
        }
      } catch (error) {
        console.error('No cart retrieved from cart query', error);
      }
    },
    /**
     * Adds a merchandise line to the cart.
     * @param lines - Array of merchandise lines to be added
     * @param optionalParams - Optional cart parameters such as country and language
     */
    async addToCart(lines: CartLineInput[], optionalParams?: CartOptionalInput) {
      if (!this.cart?.id) {
        await this.createCart();
        return;
      }

      try {
        const response = await shopify.cart.addLines({
          cartId: this.cart.id,
          lines: lines,
          ...optionalParams
        });

        if (response?.cart) {
          this.cart = response.cart;
        }
      } catch (error) {
        console.error('Cannot add item to cart', error);
      }
    },
    /**
     * Removes one or more merchandise lines from the cart.
     * @param lineIds - Array of line item IDs to be removed
     * @param optionalParams - Optional cart parameters such as country and language
     */
    async removeFromCart(lineIds: string[], optionalParams?: CartOptionalInput) {
      if (!this.cart?.id) {
        await this.createCart();
        return;
      }

      try {
        const response = await shopify.cart.removeLines({
          cartId: this.cart.id,
          lineIds: lineIds,
          ...optionalParams
        });

        if (response?.cart) {
          this.cart = response.cart;
        }
      } catch (error) {
        console.error('Cannot remove item from cart', error);
      }
    },
    /**
     * Updates one or more merchandise lines within the cart.
     * @param lines - Array of merchandise lines to be updated
     * @param optionalParams - Optional cart parameters such as country and language
     */
    async updateCart(lines: CartLineUpdateInput[], optionalParams?: CartOptionalInput) {
      if (!this.cart?.id) {
        await this.createCart();
        return;
      }

      try {
        const response = await shopify.cart.updateLines({
          cartId: this.cart.id,
          lines: lines,
          ...optionalParams
        });

        if (response?.cart) {
          this.cart = response.cart;
        }
      } catch (error) {
        console.error('Cannot update cart item', error);
      }
    },
    /**
     * Updates customer information associated with a cart.
     * @param buyerIdentity - Customer information to be updated
     * @param optionalParams - Optional cart parameters such as country and language
     */
    async attachBuyer(buyerIdentity: CartBuyerIdentityInput, optionalParams?: CartOptionalInput) {
      if (!this.cart?.id) {
        await this.createCart();
        return;
      }

      try {
        const response = await shopify.cart.updateBuyerIdentity({
          cartId: this.cart.id,
          buyerIdentity: buyerIdentity,
          ...optionalParams
        });

        if (response?.cart) {
          this.cart = response.cart;
        }
      } catch (error) {
        console.error('Cannot update cart buyer identity', error);
      }
    }
  },

  getters: {
    buyerCountryCode: (state) => state.cart?.buyerIdentity?.countryCode,
    checkoutUrl: (state) => state.cart?.checkoutUrl,
    subtotalAmount: (state) => state.cart?.cost?.subtotalAmount,
    lineItems: (state) => state.cart?.lines,
    lineItemsCount: (state) => state.cart?.totalQuantity
  },

  persist: {
    pick: ['cart']
  }
});
