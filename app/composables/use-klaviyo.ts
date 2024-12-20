export const useKlaviyo = () => {
  /**
   * Subscribes a user to a Klaviyo email list (newsletter).
   * @param email - The user's email address
   * @param listId - The ID of the specified Klaviyo list
   * @returns The response from the Klaviyo API
   */
  const subscribe = async (email: string, listId: string) => {
    try {
      return await $fetch('/api/klaviyo', {
        method: 'POST',
        body: {
          data: {
            type: 'subscription',
            attributes: {
              profile: {
                data: {
                  type: 'profile',
                  attributes: { email }
                }
              }
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: listId
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error(`Failed to process client subscription:`, error);
      throw error;
    }
  };

  /**
   * Subscribes a user to back-in-stock notifications for a product variant.
   * @param email - The user's email address
   * @param variantId - The selected variant ID
   * @returns The response from the Klaviyo API
   */
  const subscribeToBackInStock = async (email: string, variantId: string) => {
    try {
      return $fetch('/api/klaviyo', {
        method: 'POST',
        body: {
          data: {
            type: 'back-in-stock-subscription',
            attributes: {
              channels: ['EMAIL'],
              profile: {
                data: {
                  type: 'profile',
                  attributes: { email }
                }
              }
            },
            relationships: {
              variant: {
                data: {
                  type: 'catalog-variant',
                  id: `$shopify:::$default:::${variantId}`
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error(`Failed to process back-in-stock subscription:`, error);
      throw error;
    }
  };

  return {
    subscribe,
    subscribeToBackInStock
  };
};
