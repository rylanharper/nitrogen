import { defineStore } from 'pinia';

// Types
type ComponentName =
  | 'cartDrawer'
  | 'mobileMenu'
  | 'filterMenu'
  | 'searchMenu'
  | 'localeModal'
  | 'deleteAddressModal'
  | 'backInStockModal'
  | 'mediaLightbox';

type AppState = {
  [key in ComponentName]: boolean;
};

// Store
export const useAppStore = defineStore('@nitrogen/app', {
  state: (): AppState => ({
    cartDrawer: false,
    mobileMenu: false,
    filterMenu: false,
    searchMenu: false,
    localeModal: false,
    deleteAddressModal: false,
    backInStockModal: false,
    mediaLightbox: false
  }),

  actions: {
    /**
     * Toggles the visibility state of a UI element.
     * @param element - The UI element to toggle
     * @param state - Optional boolean to force a specific state
     */
    toggle(element: keyof AppState, state?: boolean) {
      this[element] = state ?? !this[element];
    }
  }
});
