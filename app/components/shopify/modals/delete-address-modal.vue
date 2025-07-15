<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core';

const props = defineProps<{
  addressId: string | null
}>();

// Stores
const appStore = useAppStore();
const authStore = useAuthStore();

// Shopify
const shopify = useShopify();

// Delete Address
const deleteAddress = async () => {
  if (!props.addressId) return;

  await shopify.customer.deleteAddress({
    id: props.addressId,
    customerAccessToken: authStore.accessToken
  });

  closeModal();
  reloadNuxtApp();
};

// Actions
const closeModal = () => {
  appStore.toggle('deleteAddressModal', false)
}

// Watchers
const { escape } = useMagicKeys()

if (escape) {
  watch(escape, closeModal)
}
</script>

<template>
  <Transition name="bg-fade">
    <section
      v-if="appStore.deleteAddressModal"
      class="fixed inset-0 z-200 bg-black/50 pointer-events-auto"
      @click="closeModal"
    />
  </Transition>
  <Transition name="fade-up">
    <div
      v-if="appStore.deleteAddressModal"
      class="fixed flex items-center justify-center size-full inset-0 z-200 pointer-events-none"
    >
      <dialog class="relative flex flex-col p-6 bg-white pointer-events-auto md:w-xl">
        <h2 class="uppercase text-center mb-2">Delete Address</h2>
        <p class="text-center">
          Are you sure you want to delete this address?
        </p>
        <div class="flex flex-col mt-6">
          <button
            class="flex items-center justify-center p-2 px-4 mb-2.5 text-normalize text-red-600 bg-red-50 border border-red-300 rounded-md transition duration-200 hover:bg-red-100"
            @click="deleteAddress"
          >
            <span>Delete</span>
          </button>
          <button
            class="flex items-center justify-center p-2 px-4 text-normalize bg-transparent border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-100"
            @click="closeModal"
          >
            <span>Cancel</span>
          </button>
        </div>
        <button
          class="flex absolute top-2 right-2 ring-1 ring-transparent ring-offset-2 rounded-xs focus:ring-black"
          @click="closeModal"
        >
          <Icon
            name="ph:x"
            class="inline-block shrink-0 !size-5"
          />
        </button>
      </dialog>
    </div>
  </Transition>
</template>

<style scoped>
@reference "tailwindcss";

.bg-fade-enter-active,
.bg-fade-leave-active {
  @apply transition duration-200 ease-out;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  @apply opacity-0;
}

.bg-fade-enter-to,
.bg-fade-leave-from {
  @apply opacity-100;
}

.fade-up-enter-active,
.fade-up-leave-active {
  @apply transition duration-200 ease-out;
}

.fade-up-enter-from,
.fade-up-leave-to {
  @apply opacity-0 transform translate-y-2 delay-0;
}

.fade-up-enter-to,
.fade-up-leave-from {
  @apply opacity-100 transform translate-y-0 delay-100;
}
</style>
