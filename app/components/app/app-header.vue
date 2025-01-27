<script setup lang="ts">
// Stores
const appStore = useAppStore();

// Actions
const toggleMobileMenu = () => {
  appStore.toggle('mobileMenu');
};

const toggleCartDrawer = () => {
  appStore.toggle('cartDrawer');
};

const toggleLocaleModal = () => {
  appStore.toggle('localeModal');
};

const toggleSearchMenu = () => {
  appStore.toggle('searchMenu');
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
      @toggle-mobile-menu="toggleMobileMenu"
    />
  </header>
</template>
