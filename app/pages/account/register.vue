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

// State
const errorMessage = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

// Register
const isAuth = computed(() => authStore.isAuthenticated);
const formCompleted = computed(
  () =>
    customer.firstName &&
    customer.lastName &&
    customer.email &&
    customer.password
);

const handleRegister = async () => {
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
    }
  } catch (error: any) {
    errorMessage.value = `${error.message}. Please try again later.`;
  } finally {
    isLoading.value = false;
  }
};

// State
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Actions
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// SEO
useHead({
  title: 'Register'
});
</script>

<template>
  <section class="relative flex flex-col items-center justify-center">
    <div class="w-full px-6 my-32 md:max-w-lg">
      <h1 class="text-xl tracking-tight leading-none text-center">
        Register
      </h1>
      <form
        class="flex flex-col my-6"
        novalidate
        @submit.prevent="handleRegister"
      >
        <div class="relative w-full mb-2.5">
          <input
            id="firstName"
            v-model="customer.firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="lastName"
            v-model="customer.lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline-1 focus:outline-black"
          >
        </div>
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
            class="flex w-full py-2 px-3.5 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline-1 focus:outline-black"
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
            minLength="8"
            required
            class="flex w-full py-2 px-3.5 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline-1 focus:outline-black"
          >
          <button
            type="button"
            class="absolute inset-y-0 end-0 flex items-center px-3"
            @click="togglePassword"
          >
            <Icon
              name="ph:eye"
              class="size-5 shrink-0"
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
            minLength="{8}"
            required
            class="flex w-full py-2 px-3.5 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline-1 focus:outline-black"
          >
          <button
            type="button"
            class="absolute inset-y-0 end-0 flex items-center px-3"
            @click="toggleConfirmPassword"
          >
            <Icon
              name="ph:eye"
              class="size-5 shrink-0"
              :class="showConfirmPassword ? 'text-black' : 'text-zinc-400'"
            />
          </button>
        </div>
        <div class="flex items-center mb-5">
          <div class="relative mr-2.5">
            <input
              id="acceptsMarketing"
              v-model="customer.acceptsMarketing"
              name="acceptsMarketing"
              type="checkbox"
              class="peer flex size-5 border border-zinc-400 appearance-none rounded-md cursor-pointer checked:border-black"
            >
            <Icon
              name="ph:check-bold"
              class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-3 shrink-0 opacity-0 text-black pointer-events-none peer-checked:opacity-100"
            />
          </div>
          <p>Subscribe to Newsletter?</p>
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          {{ isLoading === true ? 'Working...' : 'Create account' }}
        </button>
      </form>
      <div class="flex flex-col mb-10">
        <p>Have an account?</p>
        <NuxtLink
          to="/account/login"
          class="max-w-fit underline decoration-dotted decoration-1 underline-offset-[3px] hover:text-gray-500"
        >
          Login
        </NuxtLink>
      </div>
      <p
        v-if="errorMessage"
        class="w-[75%] mx-auto text-red-500 text-center"
      >
        {{ errorMessage }}
      </p>
    </div>
  </section>
</template>
