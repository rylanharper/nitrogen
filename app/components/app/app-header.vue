<script setup lang="ts">
// Stores
const appStore = useAppStore();

// Toggles
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
    <nav-desktop
      @toggleCartDrawer="toggleCartDrawer"
      @toggleLocaleModal="toggleLocaleModal"
      @toggleSearchMenu="toggleSearchMenu"
    />
    <nav-mobile
      @toggleCartDrawer="toggleCartDrawer"
      @toggleSearchMenu="toggleSearchMenu"
      @toggleShopMenu="toggleShopMenu"
    />
  </header>
</template>
