<script setup lang="ts">
// Stores
const authStore = useAuthStore()

// Route data
const route = useRoute()
const customerId = route.query.id as string
const resetToken = route.query.token as string

// State
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Register
const isAuth = computed(() => authStore.isAuthenticated)
const formCompleted = computed(() => password.value && confirmPassword.value)

const handleReset = async () => {
  errorMessage.value = ''
  isLoading.value = true

  if (!formCompleted.value) {
    errorMessage.value = 'Please fill out both password fields to reset your password.'
    isLoading.value = false
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.'
    isLoading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    isLoading.value = false
    return
  }

  if (!customerId || !resetToken) {
    errorMessage.value = 'Invalid reset link. Please request a new password reset.'
    isLoading.value = false
    return
  }

  try {
    await authStore.reset(customerId, password.value, resetToken)

    if (isAuth.value) {
      await navigateTo('/account')
    }
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = `${error.message}. Please try again later.`
    }
  } finally {
    isLoading.value = false
  }
}

// State
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Actions
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// SEO
useHead({
  title: 'Reset Password',
})
</script>

<template>
  <section class="wrapper px-6 pt-28 mx-auto md:pt-32 md:max-w-[400px] md:px-0">
    <h1 class="text-xl tracking-tight leading-none text-center">
      Enter a new password
    </h1>
    <form
      class="flex flex-col my-8"
      novalidate
      @submit.prevent="handleReset"
    >
      <div class="relative w-full mb-2.5">
        <input
          id="password"
          v-model="password"
          name="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          minLength="8"
          required
          class="flex w-full py-2 px-3 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline-1 focus:outline-black"
        >
        <button
          type="button"
          class="absolute inset-y-0 end-0 flex items-center px-3"
          @click="togglePassword"
        >
          <Icon
            name="ph:eye"
            class="inline-block shrink-0 !size-5"
            :class="showPassword ? 'text-black' : 'text-zinc-400'"
          />
        </button>
      </div>
      <div class="relative w-full mb-2.5">
        <input
          id="passwordConfirm"
          v-model="confirmPassword"
          name="passwordConfirm"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm Password"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          minLength="8"
          required
          class="flex w-full py-2 px-3 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline-1 focus:outline-black"
        >
        <button
          type="button"
          class="absolute inset-y-0 end-0 flex items-center px-3"
          @click="toggleConfirmPassword"
        >
          <Icon
            name="ph:eye"
            class="inline-block shrink-0 !size-5"
            :class="showConfirmPassword ? 'text-black' : 'text-zinc-400'"
          />
        </button>
      </div>
      <div class="flex mb-5">
        <NuxtLink
          :to="{ name: 'account-recover' }"
          class="max-w-fit hover:text-gray-500"
        >
          <span>Forgot Password?</span>
        </NuxtLink>
      </div>
      <button
        type="submit"
        :disabled="isLoading"
        class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
      >
        <span>{{ isLoading ? 'Working...' : 'Reset Password' }}</span>
      </button>
    </form>
    <p
      v-if="errorMessage"
      class="w-[75%] mx-auto text-red-500 text-center"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>
