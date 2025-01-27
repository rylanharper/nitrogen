<script setup lang="ts">
// Links
const navLinks = [
  { label: 'Shop', path: '/collections/latest' },
  { label: 'Catalog', path: '/collections/latest' },
  { label: 'Account', path: '/account' },
  { label: 'About', path: '/collections/latest' }
];

// Stores
const appStore = useAppStore();

// Actions
const closeMenu = () => {
  appStore.toggle('mobileMenu', false);
};

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
  <Transition name="bg-fade" appear>
    <div
      v-if="appStore.mobileMenu"
      class="fixed inset-0 z-[50] pointer-events-auto bg-black/50"
    />
  </Transition>
  <Transition name="clip" appear>
    <aside v-if="appStore.mobileMenu" class="fixed inset-0 z-[50] size-full bg-white">
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
</template>

<style lang="css" scoped>
.bg-fade-enter-active,
.bg-fade-leave-active {
  @apply transition duration-500 ease-out;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  @apply opacity-0;
}

.bg-fade-enter-to,
.bg-fade-leave-from {
  @apply opacity-100;
}

.clip-enter-active,
.clip-leave-active {
  @apply transition-[clip-path] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)];
}

.clip-enter-from,
.clip-leave-to {
  clip-path: inset(0% 0% 100% 0%);
}

.clip-enter-to,
.clip-leave-from {
  clip-path: inset(0% 0% 0% 0%);
}
</style>
