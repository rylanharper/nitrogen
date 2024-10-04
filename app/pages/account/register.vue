<script setup lang="ts">
// Stores
const authStore = useAuthStore();

// Customer obj
const customer = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  acceptsMarketing: false
});

// Refs
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Password toggle
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

// Register
const formCompleted = computed(
  () =>
    customer.firstName &&
    customer.lastName &&
    customer.email &&
    customer.password
);
const isAuth = computed(() => authStore.isAuthenticated);

async function handleRegister() {
  errorMessage.value = '';
  isLoading.value = true;

  if (!formCompleted.value) {
    errorMessage.value = 'Please fill out all fields to register.';
    isLoading.value = false;
    return;
  }

  if (!isEmail(customer.email)) {
    errorMessage.value = 'Please enter a valid email address.';
    isLoading.value = false;
    return;
  }

  if (customer.password.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long.';
    isLoading.value = false;
    return;
  }

  if (customer.password !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    isLoading.value = false;
    return;
  }

  try {
    await authStore.createCustomer(customer);

    if (isAuth.value) {
      await navigateTo('/account');
    } else {
      errorMessage.value = 'Something went wrong. Please try to register again or login instead.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again later.';
  } finally {
    isLoading.value = false;
  }
}

// SEO
useHead({
  title: 'Register'
});
</script>

<template>
  <section class="relative flex flex-col items-center justify-center">
    <div class="w-full px-6 my-32 md:max-w-lg">
      <h1 class="normal-case text-xl tracking-tight leading-none text-center">
        Register
      </h1>
      <form
        @submit.prevent="handleRegister"
        class="flex flex-col my-6"
        novalidate
      >
        <div class="relative w-full mb-2.5">
          <input
            id="firstName"
            name="firstName"
            type="text"
            v-model="customer.firstName"
            placeholder="First Name"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          />
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="lastName"
            name="lastName"
            type="text"
            v-model="customer.lastName"
            placeholder="Last Name"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          />
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="email"
            name="email"
            type="email"
            v-model="customer.email"
            placeholder="Email Address"
            autocapitalize="off"
            autocomplete="email"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          />
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="password"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="customer.password"
            placeholder="Password"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            minLength="8"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 end-0 flex items-center px-3"
          >
            <Icon
              name="ph:eye"
              class="h-5 w-5 shrink-0"
              :class="showPassword ? 'text-black' : 'text-zinc-400'"
            />
          </button>
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="Confirm Password"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            minLength="{8}"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          />
          <button
            type="button"
            @click="toggleConfirmPassword"
            class="absolute inset-y-0 end-0 flex items-center px-3"
          >
            <Icon
              name="ph:eye"
              class="h-5 w-5 shrink-0"
              :class="showConfirmPassword ? 'text-black' : 'text-zinc-400'"
            />
          </button>
        </div>
        <div class="flex items-center mb-5">
          <div class="relative mr-2.5">
            <input
              id="acceptsMarketing"
              name="acceptsMarketing"
              type="checkbox"
              v-model="customer.acceptsMarketing"
              class="peer flex h-5 w-5 border border-zinc-400 appearance-none rounded-md cursor-pointer checked:border-black"
            />
            <Icon
              name="ph:check-bold"
              class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 shrink-0 opacity-0 text-black pointer-events-none peer-checked:opacity-100"
            />
          </div>
          <p class="normal-case">Subscribe to Newsletter?</p>
        </div>
        <button
          type="submit"
          class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          {{ isLoading === true ? 'Working...' : 'Create account' }}
        </button>
      </form>
      <div class="flex flex-col mb-10">
        <p class="normal-case">Have an account?</p>
        <nuxt-link
          to="/account/login"
          class="max-w-fit normal-case underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 ease-in-out hover:text-zinc-500"
        >
          Login
        </nuxt-link>
      </div>
      <p
        v-if="errorMessage"
        class="w-[75%] mx-auto normal-case text-red-500 text-center"
      >
        {{ errorMessage }}
      </p>
    </div>
  </section>
</template>
