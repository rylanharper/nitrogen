<script setup lang="ts">
// Route data
const route = useRoute()
const currentPath = computed(() => route.path)

// Stores
const authStore = useAuthStore()

// Auth customer data
const customer = authStore.customer

// Select navigation
const pages = [
  { label: 'Dashboard', path: '/account' },
  { label: 'Orders', path: '/account/orders' },
  { label: 'Addresses', path: '/account/addresses' },
  { label: 'Logout', path: 'logout' },
]

// State
const selectedPage = ref(currentPath.value)

// Actions
const logout = async () => {
  await authStore.logout()
  await navigateTo('/account/login')
}

const navigateToSelectedPage = async () => {
  if (selectedPage.value !== 'logout') {
    await navigateTo(selectedPage.value)
  } else {
    logout()
  }
}

// Watch if the user navigates to sub-address paths
// If so, update the `currentPath` to match `/account/addresses`
const updateSelectedPage = () => {
  const addressPaths = [
    '/account/addresses',
    '/account/addresses/add',
    '/account/addresses/edit',
  ]

  selectedPage.value = addressPaths.includes(currentPath.value)
    ? '/account/addresses'
    : currentPath.value
}

// Watchers
watch(currentPath, updateSelectedPage)
</script>

<template>
  <div
    v-if="customer"
    class="col-span-1 size-full px-4 lg:border-r lg:border-zinc-200"
  >
    <div class="flex flex-col gap-4 mt-6 lg:gap-10">
      <h2 class="px-2 text-xl tracking-tight leading-none">
        Hello {{ customer.firstName }}!
      </h2>
      <nav class="hidden lg:flex lg:flex-col lg:gap-1.5">
        <NuxtLink
          to="/account"
          class="flex items-center justify-start p-2 px-2.5 gap-2.5 text-normalize rounded-md transition duration-200 hover:bg-zinc-100"
          :class="{ 'text-black bg-zinc-100': route.path === '/account' }"
        >
          <Icon
            name="ph:globe"
            class="inline-block shrink-0 !size-5"
          />
          <span>Dashboard</span>
        </NuxtLink>
        <NuxtLink
          to="/account/orders"
          class="flex items-center justify-start p-2 px-2.5 gap-2.5 text-normalize rounded-md transition duration-200 hover:bg-zinc-100"
          :class="{ 'text-black bg-zinc-100': route.path === '/account/orders' }"
        >
          <Icon
            name="ph:tag"
            class="inline-block shrink-0 !size-5"
          />
          <span>Orders</span>
        </NuxtLink>
        <NuxtLink
          to="/account/addresses"
          class="flex items-center justify-start p-2 px-2.5 gap-2.5 text-normalize rounded-md transition duration-200 hover:bg-zinc-100"
          :class="{ 'text-black bg-zinc-100': route.path === '/account/addresses' || route.path.includes('/account/addresses/') }"
        >
          <Icon
            name="ph:map-pin"
            class="inline-block shrink-0 !size-5"
          />
          <span>Addresses</span>
        </NuxtLink>
        <button
          class="flex items-center justify-start p-2 px-2.5 gap-2.5 text-normalize rounded-md transition duration-200 hover:bg-zinc-100"
          @click="logout"
        >
          <Icon
            name="ph:sign-out"
            class="inline-block shrink-0 !size-5"
          />
          <span>Logout</span>
        </button>
      </nav>
      <nav class="relative flex lg:hidden">
        <select
          id="navigation"
          v-model="selectedPage"
          name="SelectCountry"
          class="flex w-full py-2 px-4 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-black focus:outline-1 focus:outline-black"
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
          <Icon
            name="ph:caret-up-down"
            class="inline-block shrink-0 !size-4"
          />
        </span>
      </nav>
    </div>
  </div>
</template>
