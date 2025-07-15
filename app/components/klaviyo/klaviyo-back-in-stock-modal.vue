<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core';

import { isEmail } from '@/utils/validators';

// Props
const props = defineProps<{
  variantId: string | undefined;
}>();

// Stores
const appStore = useAppStore();

// State
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Klaviyo
const klaviyo = useKlaviyo();

// Subscribe
const handleBackInStock = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  if (!isEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.';
    isLoading.value = false;
    return;
  }

  if (!props.variantId) {
    errorMessage.value = 'No variant ID found.';
    isLoading.value = false;
    return;
  }

  try {
    await klaviyo.subscribe.backInStock(email.value, props.variantId);
    successMessage.value = 'Thanks! We will notify you when this product is back in stock.';
  } catch (error: any) {
    errorMessage.value = `${error.message}. Please try again later.`;
  } finally {
    email.value = '';
    isLoading.value = false;
  }
};

// Actions
const closeModal = () => {
  appStore.toggle('backInStockModal', false);
};

// Watchers
const { escape } = useMagicKeys();

watch(
  () => appStore.backInStockModal,
  (isOpen) => {
    if (!isOpen) {
      errorMessage.value = '';
      successMessage.value = '';
    }
  }
);

if (escape) {
  watch(escape, closeModal)
}
</script>

<template>
  <Transition name="bg-fade">
    <section
      v-if="appStore.backInStockModal"
      class="fixed inset-0 z-200 bg-black/50 pointer-events-auto"
      @click="closeModal"
    />
  </Transition>
  <Transition name="fade-up">
    <div
      v-if="appStore.backInStockModal"
      class="fixed flex items-center justify-center size-full inset-0 z-200 pointer-events-none"
    >
      <dialog class="relative flex flex-col p-6 bg-white pointer-events-auto md:w-xl">
        <h2 class="uppercase text-center mb-2">
          Notify Me
          <span class="normal-case">
            (Klaviyo)
          </span>
        </h2>
        <p class="text-center">
          Get notified when this product is back in stock.
        </p>
        <form class="flex flex-col mt-6" novalidate @submit.prevent="handleBackInStock">
          <div class="relative w-full mb-2.5">
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              placeholder="Email Address"
              autocapitalize="off"
              autocomplete="email"
              autocorrect="off"
              required
              class="flex w-full py-2 px-3.5 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline-1 focus:outline-black"
            >
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
          >
            <span>{{ isLoading ? 'Submitting...' : 'Submit' }}</span>
          </button>
        </form>
        <button
          class="flex absolute top-2 right-2 ring-1 ring-transparent ring-offset-2 rounded-xs focus:ring-black"
          @click="closeModal"
        >
          <Icon
            name="ph:x"
            class="inline-block shrink-0 !size-5"
          />
        </button>
        <p v-if="errorMessage" class="w-[75%] mt-6 mx-auto text-red-500 text-center">
          {{ errorMessage }}
        </p>
        <p v-if="successMessage" class="w-[75%] mt-6 mx-auto text-blue-600 text-center">
          {{ successMessage }}
        </p>
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
