<script setup lang="ts">
// Route
const route = useRoute();

// Stores
const authStore = useAuthStore();

// Auth customer data
const customer = authStore.customer;

// Select navigation
const pages = [
  { label: 'Dashboard', path: '/account' },
  { label: 'Orders', path: '/account/orders' },
  { label: 'Addresses', path: '/account/addresses' },
  { label: 'Logout', path: 'logout' }
];

const currentPath = computed(() => route.path);
const selectedPage = ref(currentPath.value);

// Actions
const logout = async () => {
  await authStore.logout();
  await navigateTo('/account/login');
};

const navigateToSelectedPage = async () => {
  if (selectedPage.value !== 'logout') {
    await navigateTo(selectedPage.value);
  } else {
    logout();
  }
};

// Watch if the user navigates to sub-address paths
// If so, update the `currentPath` to match `/account/addresses`
const updateSelectedPage = () => {
  const addressPaths = [
    '/account/addresses',
    '/account/addresses/add',
    '/account/addresses/edit'
  ];

  selectedPage.value = addressPaths.includes(currentPath.value)
    ? '/account/addresses'
    : currentPath.value;
};

watch(currentPath, () => {
  updateSelectedPage();
});
</script>

<template>
  <div
    v-if="customer"
    class="col-span-1 size-full px-4 lg:border-r lg:border-zinc-200"
  >
    <div class="flex flex-col gap-4 mt-6 lg:gap-10">
      <div class="px-2">
        <h2 class="normal-case text-xl tracking-tight leading-none">
          Hello {{ customer.firstName }}!
        </h2>
      </div>
      <nav class="hidden lg:flex lg:flex-col lg:gap-1">
        <NuxtLink
          to="/account"
          class="flex items-center px-2.5 py-2 gap-2.5 text-normalize rounded-md transition duration-200 hover:bg-zinc-100"
          :class="{ 'text-black bg-zinc-100': route.path === '/account' }"
        >
          <Icon name="ph:globe" class="h-5 w-5 shrink-0" />
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/account/orders"
          class="flex items-center px-2.5 py-2 gap-2.5 text-normalize rounded-md transition duration-200 hover:bg-zinc-100"
          :class="{ 'text-black bg-zinc-100': route.path === '/account/orders'}"
        >
          <Icon name="ph:tag" class="h-5 w-5 shrink-0" />
          Orders
        </NuxtLink>
        <NuxtLink
          to="/account/addresses"
          class="flex items-center px-2.5 py-2 gap-2.5 text-normalize rounded-md transition duration-200 hover:bg-zinc-100"
          :class="{'text-black bg-zinc-100': route.path === '/account/addresses' || route.path.includes('/account/addresses/')}"
        >
          <Icon name="ph:map-pin" class="h-5 w-5 shrink-0" />
          Addresses
        </NuxtLink>
        <button
          class="flex items-center px-2.5 py-2 gap-2.5 text-normalize rounded-md transition duration-200 hover:bg-zinc-100"
          @click="logout"
        >
          <Icon name="ph:sign-out" class="h-5 w-5 shrink-0" />
          Logout
        </button>
      </nav>
      <nav class="relative flex lg:hidden">
        <select
          id="navigation"
          v-model="selectedPage"
          name="SelectCountry"
          class="flex w-full py-2 px-4 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-black focus:outline focus:outline-1 focus:outline-black"
          @change="navigateToSelectedPage"
        >
          <option
            v-for="page in pages"
            :key="page.path"
            :value="page.path"
            :selected="currentPath === page.path"
          >
            {{ page.label }}
          </option>
        </select>
        <span class="absolute inset-y-0 end-0 flex items-center pointer-events-none px-3">
          <Icon name="ph:caret-up-down" class="h-4 w-4 shrink-0" />
        </span>
      </nav>
    </div>
  </div>
</template>
