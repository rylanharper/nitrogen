<script setup lang="ts">
// Stores
const appStore = useAppStore();

// Actions
const toggleShopMenu = () => {
  appStore.toggleMobileMenu();
};

const toggleCartDrawer = () => {
  appStore.toggleCartDrawer();
};

const toggleLocaleModal = () => {
  appStore.toggleLocaleModal();
};

const toggleSearchMenu = () => {
  appStore.toggleSearchMenu();
};
</script>

<template>
  <header class="sticky top-0 left-0 w-full z-[100] bg-white border-b border-zinc-200">
    <NavDesktop
      @toggle-cart-drawer="toggleCartDrawer"
      @toggle-locale-modal="toggleLocaleModal"
      @toggle-search-menu="toggleSearchMenu"
    />
    <NavMobile
      @toggle-cart-drawer="toggleCartDrawer"
      @toggle-search-menu="toggleSearchMenu"
      @toggle-shop-menu="toggleShopMenu"
    />
  </header>
</template>
