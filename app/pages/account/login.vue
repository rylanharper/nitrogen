<script setup lang="ts">
import { isEmail } from '@/utils/validators'

// Stores
const authStore = useAuthStore()
const cartStore = useCartStore()

// Customer obj
const customer = reactive({
  email: '',
  password: '',
})

// State
const errorMessage = ref('')
const isLoading = ref(false)

// Login
const isAuth = computed(() => authStore.isAuthenticated)
const formCompleted = computed(() => customer.email && customer.password)

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  if (!formCompleted.value) {
    errorMessage.value = 'Please fill out both the email and password fields to sign in.'
    isLoading.value = false
    return
  }

  if (!isEmail(customer.email)) {
    errorMessage.value = 'Please enter a valid email address.'
    isLoading.value = false
    return
  }

  try {
    await authStore.login(customer.email, customer.password)

    if (isAuth.value) {
      await cartStore.attachBuyer({ customerAccessToken: authStore.accessToken })
      await navigateTo('/account')
    }
  } catch (error: any) {
    errorMessage.value = `${error.message}. Please try again later.`
  } finally {
    isLoading.value = false
  }
}

// State
const showPassword = ref(false)

// Actions
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// SEO
useHead({
  title: 'Login',
})
</script>

<template>
  <section class="wrapper px-6 pt-28 mx-auto md:pt-32 md:max-w-[400px] md:px-0">
    <h1 class="text-xl tracking-tight leading-none text-center">
      Login
    </h1>
    <form
      class="flex flex-col my-8"
      novalidate
      @submit.prevent="handleLogin"
    >
      <div class="relative w-full mb-2.5">
        <input
          id="email"
          v-model="customer.email"
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
      <div class="relative w-full mb-2.5">
        <input
          id="password"
          v-model="customer.password"
          name="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          minLength="{8}"
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
      <div class="flex mb-5">
        <NuxtLink
          :to="{ name: 'account-recover' }"
          class="max-w-fit hover:text-gray-500"
        >
          Forgot Password?
        </NuxtLink>
      </div>
      <button
        type="submit"
        :disabled="isLoading"
        class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
      >
        <span>{{ isLoading === true ? 'Working...' : 'Sign in' }}</span>
      </button>
    </form>
    <div class="flex flex-col mb-10">
      <p>New to Nitrogen?</p>
      <NuxtLink
        to="/account/register"
        class="max-w-fit underline decoration-dotted decoration-1 underline-offset-[3px] hover:text-gray-500"
      >
        <span>Create an account</span>
      </NuxtLink>
    </div>
    <p
      v-if="errorMessage"
      class="w-[75%] mx-auto text-red-500 text-center"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>
