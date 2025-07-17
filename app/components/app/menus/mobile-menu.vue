<script setup lang="ts">
// Links
const navLinks = [
  { label: 'Shop', path: '/collections/latest' },
  { label: 'Catalog', path: '/collections/latest' },
  { label: 'Account', path: '/account' },
  { label: 'About', path: '/collections/latest' },
]

// Stores
const appStore = useAppStore()

// Actions
const closeMenu = () => {
  appStore.toggle('mobileMenu', false)
}

// Watchers
const route = useRoute()
const { escape } = useMagicKeys()

watch(() => route.path, closeMenu)

if (escape) {
  watch(escape, closeMenu)
}
</script>

<template>
  <Transition name="bg-fade">
    <div
      v-if="appStore.mobileMenu"
      class="fixed inset-0 z-50 bg-black/50 pointer-events-auto"
    />
  </Transition>
  <Transition name="clip">
    <aside
      v-if="appStore.mobileMenu"
      class="fixed inset-0 size-full z-50 bg-white"
    >
      <div class="flex flex-col size-full px-6">
        <div class="flex flex-col flex-1 mt-(--header-height) py-6 overflow-y-scroll overflow-x-hidden no-scrollbar">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.path"
            class="py-1 text-xl tracking-tight"
          >
            <span>{{ link.label }}</span>
          </NuxtLink>
        </div>
        <div class="flex flex-col mb-4">
          <button
            class="flex items-center justify-center p-2 px-4 bg-transparent border border-zinc-300 rounded-md"
            @click="closeMenu"
          >
            <span class="text-normalize">
              Close Menu
            </span>
          </button>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
@reference "tailwindcss";

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
