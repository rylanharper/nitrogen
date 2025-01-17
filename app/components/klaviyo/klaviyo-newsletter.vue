<script setup lang="ts">
// State
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Helpers
const { subscribe } = useKlaviyo();
const listId = 'StGPx7';

// Klaviyo
const handleNewsletter = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  if (!isEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.';
    isLoading.value = false;
    return;
  }

  try {
    await subscribe(email.value, listId);
    successMessage.value = 'You have successfully subscribed!';
  } catch (error: any) {
    errorMessage.value = `${error.message}. Please try again later.`;
  } finally {
    email.value = '';
    isLoading.value = false;
  }
};

// Watchers
const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    errorMessage.value = '';
    successMessage.value = '';
  }
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3>Newsletter <span class="normal-case">(Klaviyo)</span></h3>
    <form novalidate @submit.prevent="handleNewsletter">
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
        class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
      >
        {{ isLoading ? 'Subscribing...' : 'Subscribe' }}
      </button>
    </form>
    <p v-if="errorMessage" class="normal-case text-red-500">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="normal-case text-blue-600">
      {{ successMessage }}
    </p>
  </div>
</template>
