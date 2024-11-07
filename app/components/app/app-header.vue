<script setup lang="ts">
// Stores
const appStore = useAppStore();

// Actions
function toggleShopMenu() {
  appStore.toggleMobileMenu();
}

function toggleCartDrawer() {
  appStore.toggleCartDrawer();
}

function toggleLocaleModal() {
  appStore.toggleLocaleModal();
}

function toggleSearchMenu() {
  appStore.toggleSearchMenu();
}
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
