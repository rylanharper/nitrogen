import { defineStore } from 'pinia';

// Store
export const useAppStore = defineStore('@nitrogen/app', {
  state: () => {
    return {
      cartDrawerOpen: false,
      mobileMenuOpen: false,
      filterMenuOpen: false,
      searchMenuOpen: false,
      localeModalOpen: false,
      backInStockModalOpen: false,
      mediaLightboxOpen: false
    };
  },

  actions: {
    /**
     * Toggles the cart drawer.
     */
    toggleCartDrawer(state?: boolean) {
      this.cartDrawerOpen = state ?? !this.cartDrawerOpen;
    },
    /**
     * Toggles the mobile menu.
     */
    toggleMobileMenu(state?: boolean) {
      this.mobileMenuOpen = state ?? !this.mobileMenuOpen;
    },
    /**
     * Toggles the collection filter menu.
     */
    toggleFilterMenu(state?: boolean) {
      this.filterMenuOpen = state ?? !this.filterMenuOpen;
    },
    /**
     * Toggles the search menu.
     */
    toggleSearchMenu(state?: boolean) {
      this.searchMenuOpen = state ?? !this.searchMenuOpen;
    },
    /**
     * Toggles the localization modal.
     */
    toggleLocaleModal(state?: boolean) {
      this.localeModalOpen = state ?? !this.localeModalOpen;
    },
    /**
     * Toggles the back-in-stock modal.
     */
    toggleBackInStockModal(state?: boolean) {
      this.backInStockModalOpen = state ?? !this.backInStockModalOpen;
    },
    /**
     * Toggles the product media lightbox.
     */
    toggleMediaLightbox(state?: boolean) {
      this.mediaLightboxOpen = state ?? !this.mediaLightboxOpen;
    },
  }
});
