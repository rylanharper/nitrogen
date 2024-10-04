<script setup lang="ts">
import { useAppStore } from '@/stores/app';

// Links
const navLinks = [
  { label: 'Shop', path: '/' },
  { label: 'Catalog', path: '/' },
  { label: 'Account', path: '/account' },
  { label: 'About', path: '/' }
];

// Stores
const appStore = useAppStore();

// Close menu
function closeMenu() {
  appStore.mobileMenuOpen = false;
}

// Watchers
const route = useRoute();

watch(
  () => route.path,
  () => {
    closeMenu();
  }
);
</script>

<template>
  <transition name="clip" mode="out-in" appear>
    <aside v-if="appStore.mobileMenuOpen" class="fixed inset-0 z-[80] size-full bg-white">
      <div class="flex flex-col size-full px-6">
        <div class="flex flex-col flex-1 mt-20 overflow-y-scroll overflow-x-hidden no-scrollbar">
          <nuxt-link
            v-for="link in navLinks"
            :key="link.label"
            :to="link.path"
            class="py-1 normal-case text-xl tracking-tight"
          >
            {{ link.label }}
          </nuxt-link>
        </div>
        <div class="flex flex-col my-4">
          <button
            @click="closeMenu"
            class="flex items-center justify-center p-2 text-normalize bg-transparent border border-zinc-300 rounded-md"
          >
            Close Menu
          </button>
        </div>
      </div>
    </aside>
  </transition>
  <transition name="fade" mode="out-in" appear>
    <div
      v-if="appStore.mobileMenuOpen"
      class="fixed inset-0 z-[50] pointer-events-auto bg-black/50"
    />
  </transition>
</template>

<style lang="css" scoped>
.clip-enter-active,
.clip-leave-active {
  clip-path: inset(0% 0% 0% 0%);
  transition: clip-path;
  @apply duration-700 ease-[cubic-bezier(0.32,0.72,0,1)];
}

.clip-enter-from,
.clip-leave-to {
  clip-path: inset(0% 0% 100% 0%);
  transition: clip-path;
  @apply duration-700 ease-[cubic-bezier(0.32,0.72,0,1)];
}

.fade-enter-active,
.fade-leave-active {
  @apply opacity-100;
  @apply transition duration-500 ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
  @apply transition duration-300 ease-in-out;
}
</style>
