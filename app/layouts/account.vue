<script setup lang="ts">
// Stores
const authStore = useAuthStore()

// Customer data
const customer = authStore.customer
</script>

<template>
  <main
    role="main"
    class="flex flex-col min-h-[100svh] pt-[var(--header-height)]"
  >
    <div
      v-if="!customer"
      class="fixed top-(--header-height) left-0 w-full h-fit text-zinc-100 bg-line-pattern border-b border-zinc-200"
    >
      <div class="flex items-center justify-center gap-2.5 py-2">
        <Icon
          name="ph:warning-circle"
          class="inline-block shrink-0 !size-5"
        />
        <p class="text-normalize">503: No Shopify data found.</p>
      </div>
    </div>

    <div
      v-else-if="customer"
      class="grid grid-cols-1 gap-10 lg:grid-cols-[280px_2fr_280px] lg:min-h-screen lg:gap-0"
    >
      <account-menu />
      <slot />
    </div>
  </main>
</template>
