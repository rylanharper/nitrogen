<script setup lang="ts">
// Stores
const authStore = useAuthStore();

// State
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Recover
const formCompleted = computed(() => email.value);

const handleRecover = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  if (!formCompleted.value) {
    errorMessage.value = 'Please provide a valid email address to recover your password.';
    isLoading.value = false;
    return;
  }

  if (!isEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.';
    isLoading.value = false;
    return;
  }

  try {
    await authStore.recover(email.value);
    successMessage.value = 'Success! Please check your email for instructions on how to reset your password.';
  } catch (error) {
    console.error('Error during password recovery:', error);

    if (error instanceof Error) {
      errorMessage.value = `${error.message}. Please try again later.`;
    }
  } finally {
    isLoading.value = false;
  }
};

// SEO
useHead({
  title: 'Recover'
});
</script>

<template>
  <section class="relative flex flex-col items-center justify-center">
    <div class="w-full px-6 my-32 md:max-w-lg">
      <h1 class="normal-case text-xl tracking-tight leading-none text-center">
        Forgot password?
      </h1>
      <form
        class="flex flex-col my-6"
        novalidate
        @submit.prevent="handleRecover"
      >
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
        <p class="mb-5 normal-case leading-snug text-pretty">
          If your email is in our system, you will receive an email with
          instructions about how to reset your password.
        </p>
        <button
          type="submit"
          :disabled="isLoading"
          class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          {{ isLoading === true ? 'Working...' : 'Send reset link' }}
        </button>
      </form>
      <div class="flex flex-col mb-10">
        <p class="normal-case">Need to login?</p>
        <NuxtLink
          to="/account/login"
          class="max-w-fit normal-case underline decoration-dotted decoration-1 underline-offset-[3px] hover:text-gray-500"
        >
          Sign in
        </NuxtLink>
      </div>
      <p
        v-if="errorMessage"
        class="w-[75%] mx-auto normal-case text-red-500 text-center"
      >
        {{ errorMessage }}
      </p>
      <p
        v-if="successMessage"
        class="w-[75%] mx-auto normal-case text-blue-600 text-center"
      >
        {{ successMessage }}
      </p>
    </div>
  </section>
</template>
