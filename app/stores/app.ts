import { defineStore } from 'pinia';

// Types
type appState = {
  cartDrawer: boolean;
  mobileMenu: boolean;
  filterMenu: boolean;
  searchMenu: boolean;
  localeModal: boolean;
  backInStockModal: boolean;
  mediaLightbox: boolean;
};

// Store
export const useAppStore = defineStore('@nitrogen/app', {
  state: (): appState => ({
    cartDrawer: false,
    mobileMenu: false,
    filterMenu: false,
    searchMenu: false,
    localeModal: false,
    backInStockModal: false,
    mediaLightbox: false
  }),

  actions: {
    /**
     * Toggles the visibility state of a UI element.
     * @param element - The UI element to toggle
     * @param state - Optional boolean to force a specific state
     */
    toggle(element: keyof appState, state?: boolean) {
      this[element] = state ?? !this[element];
    }
  }
});
