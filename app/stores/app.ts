import { defineStore } from 'pinia';

// Store
export const useAppStore = defineStore('@yeren/app', {
  state: () => {
    return {
      cartDrawerOpen: false,
      mobileMenuOpen: false,
      localeModalOpen: false,
      filterMenuOpen: false,
      searchMenuOpen: false
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
     * Toggles the localization modal.
     */
    toggleLocaleModal(state?: boolean) {
      this.localeModalOpen = state ?? !this.localeModalOpen;
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
    }
  }
});
