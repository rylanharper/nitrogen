<script setup lang="ts">
import type { CustomerQueryVariables, MailingAddressInput } from '@@/types/shopify';

// Stores
const authStore = useAuthStore();
const shopStore = useShopStore();

// Shopify
const shopify = useShopify();

// Fetch data
const customerVars = computed<CustomerQueryVariables>(() => ({
  customerAccessToken: authStore.accessToken,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}));

const { data: customerData } = await useAsyncData(
  'customer-data',
  () => shopify.customer.get(customerVars.value),
  { watch: [customerVars] }
);

// Computed data
const customer = computed(() => customerData.value);

// Address
const address = reactive<MailingAddressInput>({
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  country: '',
  province: '',
  zip: '',
  phone: '',
  company: ''
});

// State
const errorMessage = ref('');
const isLoading = ref(false);
const defaultAddress = ref(false);

// Add address
const formCompleted = computed(
  () =>
    address.firstName &&
    address.lastName &&
    address.address1 &&
    address.city &&
    address.country &&
    address.province &&
    address.zip
);

const handleNewAddress = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  if (!formCompleted.value) {
    errorMessage.value = 'Please fill out all necessary fields to add your address.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await shopify.customer.createAddress({
      address: { ...address },
      customerAccessToken: authStore.accessToken
    });

    if (response?.customerUserErrors?.length) {
      throw new Error(response?.customerUserErrors[0]?.message);
    }

    const newId = response?.customerAddress?.id;

    if (newId && defaultAddress.value) {
      await shopify.customer.updateDefaultAddress({
        addressId: newId,
        customerAccessToken: authStore.accessToken
      });
    }

    if (response?.customerAddress) {
      await navigateTo('/account/addresses');
    } else {
      errorMessage.value = 'Failed to create address. Please verify your address details and try again.';
    }
  } catch (error) {
    console.error('Error during address creation:', error);

    if (error instanceof Error) {
      errorMessage.value = `${error.message}. Please try again later.`;
    }
  } finally {
    isLoading.value = false;
  }
};

// SEO
useHead({
  title: 'Add Address'
});

// Layouts
definePageMeta({
  layout: 'account'
});
</script>

<template>
  <section
    v-if="customer && address"
    class="relative flex flex-col lg:col-span-2 2xl:col-span-1 mb-20"
  >
    <div class="flex flex-col px-6 lg:mt-6 lg:px-8 lg:max-w-lg">
      <h2 class="normal-case text-xl tracking-tight leading-none">
        Add Address
      </h2>
      <form
        class="flex flex-col my-6"
        novalidate
        @submit.prevent="handleNewAddress"
      >
        <div class="relative w-full mb-2.5">
          <input
            id="firstName"
            v-model="address.firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="lastName"
            v-model="address.lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="address1"
            v-model="address.address1"
            name="address1"
            type="text"
            placeholder="Street Address"
            autocapitalize="off"
            autocomplete="address-line1"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="address2"
            v-model="address.address2"
            name="address2"
            type="text"
            placeholder="Suite/Apt (Optional)"
            autocapitalize="off"
            autocomplete="address-line2"
            autocorrect="off"
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="city"
            v-model="address.city"
            name="city"
            type="text"
            placeholder="City"
            autocapitalize="off"
            autocomplete="address-level2"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="country"
            v-model="address.country"
            name="country"
            type="text"
            placeholder="Country"
            autocapitalize="off"
            autocomplete="country"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="province"
            v-model="address.province"
            name="province"
            type="text"
            placeholder="Province"
            autocapitalize="off"
            autocomplete="address-level1"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="zip"
            v-model="address.zip"
            name="zip"
            type="text"
            placeholder="ZIP / Postal Code"
            autocapitalize="off"
            autocomplete="postal-code"
            autocorrect="off"
            required
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="phone"
            v-model="address.phone"
            name="phone"
            type="text"
            placeholder="Phone (Optional)"
            autocapitalize="off"
            autocomplete="tel"
            autocorrect="off"
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="relative w-full mb-2.5">
          <input
            id="company"
            v-model="address.company"
            name="company"
            type="text"
            placeholder="Company (Optional)"
            autocapitalize="off"
            autocomplete="organization"
            autocorrect="off"
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-zinc-400 focus:outline focus:outline-1 focus:outline-black"
          >
        </div>
        <div class="flex items-center mb-5">
          <div class="relative mr-2.5">
            <input
              id="defaultAddress"
              v-model="defaultAddress"
              name="defaultAddress"
              type="checkbox"
              class="peer flex h-5 w-5 border border-zinc-400 appearance-none rounded-md cursor-pointer checked:border-black"
            >
            <Icon
              name="ph:check-bold"
              class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 shrink-0 opacity-0 text-black pointer-events-none peer-checked:opacity-100"
            />
          </div>
          <p class="normal-case">Set as default address</p>
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          {{ isLoading === true ? 'Working...' : 'Add Address' }}
        </button>
      </form>
      <div class="flex flex-col mb-10">
        <p class="normal-case">Don&apos;t want to add a new address?</p>
        <NuxtLink
          to="/account"
          class="max-w-fit normal-case underline decoration-dotted decoration-1 underline-offset-[3px] transition duration-200 ease-in-out hover:text-zinc-500"
        >
          Go Back
        </NuxtLink>
      </div>
      <p
        v-if="errorMessage"
        class="w-[75%] mx-auto normal-case text-red-500 text-center"
      >
        {{ errorMessage }}
      </p>
    </div>
  </section>
  <section v-else class="flex items-center self-start p-6 gap-2">
    <Icon name="ph:seal-warning" class="h-5 w-5 shrink-0" />
    <p class="normal-case">No customer data found.</p>
  </section>
</template>
