<script setup lang="ts">
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

// Helpers
const { subscribeToBackInStock } = useKlaviyo();

// Klaviyo subscribe
const handleSubscribe = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

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
    await subscribeToBackInStock(email.value, props.variantId);
    successMessage.value = 'Thanks! We will notify you when this product is back in stock.';
    email.value = '';
  } catch (error: any) {
    console.error('Failed to subscribe to back-in-stock notifications:', error);
    errorMessage.value = error.message || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Actions
const closeModal = () => {
  appStore.backInStockModalOpen = false;
};

// Watchers
const route = useRoute();
const { escape } = useMagicKeys();

watch(
  () => appStore.backInStockModalOpen,
  (isOpen) => {
    if (!isOpen) {
      errorMessage.value = '';
      successMessage.value = '';
    }
  }
);

watch(
  () => route.path,
  () => {
    closeModal();
  }
);

if (escape) {
  watch(escape, () => {
    closeModal();
  });
}
</script>

<template>
  <Transition name="scale-in" mode="out-in" appear>
    <div
      v-if="appStore.backInStockModalOpen"
      class="fixed left-[50%] top-[50%] w-full max-w-xl translate-x-[-50%] translate-y-[-50%] p-6 z-[200] bg-white"
    >
      <h2 class="text-center mb-2">Notify Me <span class="normal-case">(Klaviyo)</span></h2>
      <p class="normal-case text-center">
        Get notified when this product is back in stock.
      </p>
      <form class="flex flex-col mt-6 mb-2" novalidate @submit.prevent="handleSubscribe">
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
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          {{ isLoading ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
      <button
        class="flex absolute top-2 right-2 ring-1 ring-transparent ring-offset-2 rounded-sm focus:ring-black"
        @click="closeModal"
      >
        <Icon name="ph:x" class="h-5 w-5 shrink-0" />
      </button>
      <p v-if="errorMessage" class="w-[75%] mt-6 mx-auto normal-case text-red-500 text-center">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="w-[75%] mt-6 mx-auto normal-case text-blue-600 text-center">
        {{ successMessage }}
      </p>
    </div>
  </Transition>
  <Transition name="fade" mode="out-in" appear>
    <section
      v-if="appStore.backInStockModalOpen"
      class="fixed inset-0 z-[150] pointer-events-auto bg-black/50"
      @click="closeModal"
    />
  </Transition>
</template>

<style lang="css" scoped>
.scale-in-enter-active,
.scale-in-leave-active {
  @apply opacity-100;
  @apply transform scale-100;
  @apply transition duration-200 ease-out delay-100;
}

.scale-in-enter-from,
.scale-in-leave-to {
  @apply opacity-0;
  @apply transform scale-[.99];
  @apply transition duration-200 ease-out delay-0;
}

.fade-enter-active,
.fade-leave-active {
  @apply opacity-100;
  @apply transition duration-200 ease-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
  @apply transition duration-200 ease-out;
}
</style>
