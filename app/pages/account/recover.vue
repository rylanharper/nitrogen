<script setup lang="ts">
import { isEmail } from '@/utils/validators'

// Stores
const authStore = useAuthStore()

// State
const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Recover
const formCompleted = computed(() => email.value)

const handleRecover = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  if (!formCompleted.value) {
    errorMessage.value = 'Please provide a valid email address to recover your password.'
    isLoading.value = false
    return
  }

  if (!isEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.'
    isLoading.value = false
    return
  }

  try {
    await authStore.recover(email.value)
    successMessage.value = 'Success! Please check your email for instructions on how to reset your password.'
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = `${error.message}. Please try again later.`
    }
  } finally {
    isLoading.value = false
  }
}

// SEO
useHead({
  title: 'Recover',
})
</script>

<template>
  <section class="wrapper px-6 pt-28 md:pt-32 md:max-w-[400px] md:px-0">
    <h1 class="text-xl tracking-tight leading-none text-center">
      Forgot password?
    </h1>
    <form
      class="flex flex-col my-8"
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
          class="flex w-full py-2 px-3 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline-1 focus:outline-black"
        >
      </div>
      <p class="mb-5 leading-snug text-pretty">
        If your email is in our system, you will receive an email with
        instructions about how to reset your password.
      </p>
      <button
        type="submit"
        :disabled="isLoading"
        class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
      >
        <span>{{ isLoading === true ? 'Working...' : 'Send reset link' }}</span>
      </button>
    </form>
    <div class="flex flex-col mb-10">
      <p>Need to login?</p>
      <NuxtLink
        to="/account/login"
        class="max-w-fit underline decoration-dotted decoration-1 underline-offset-[3px] hover:text-gray-500"
      >
        <span>Sign in</span>
      </NuxtLink>
    </div>
    <p
      v-if="errorMessage"
      class="w-[75%] mx-auto text-red-500 text-center"
    >
      {{ errorMessage }}
    </p>
    <p
      v-if="successMessage"
      class="w-[75%] mx-auto text-blue-600 text-center"
    >
      {{ successMessage }}
    </p>
  </section>
</template>
