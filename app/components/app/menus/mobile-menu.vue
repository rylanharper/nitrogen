<script setup lang="ts">
// Links
const navLinks = [
  { label: 'Shop', path: '/collections/latest' },
  { label: 'Catalog', path: '/collections/latest' },
  { label: 'Account', path: '/account' },
  { label: 'About', path: '/collections/latest' },
];

// Stores
const appStore = useAppStore();

// Actions
const closeMenu = () => {
  appStore.mobileMenuOpen = false;
};

// Watchers
const route = useRoute();

watch(
  () => route.path,
  () => {
    closeMenu();
  },
);
</script>

<template>
  <Transition
    name="clip"
    mode="out-in"
    appear
  >
    <aside
      v-if="appStore.mobileMenuOpen"
      class="fixed inset-0 z-[80] size-full bg-white"
    >
      <div class="flex flex-col size-full px-6">
        <div class="flex flex-col flex-1 mt-16 overflow-y-scroll overflow-x-hidden no-scrollbar">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.path"
            class="py-1 normal-case text-xl tracking-tight"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="flex flex-col my-4">
          <button
            class="flex items-center justify-center p-2 text-normalize bg-transparent border border-zinc-300 rounded-md"
            @click="closeMenu"
          >
            Close Menu
          </button>
        </div>
      </div>
    </aside>
  </Transition>
  <Transition
    name="fade"
    mode="out-in"
    appear
  >
    <div
      v-if="appStore.mobileMenuOpen"
      class="fixed inset-0 z-[50] pointer-events-auto bg-black/50"
    />
  </Transition>
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
