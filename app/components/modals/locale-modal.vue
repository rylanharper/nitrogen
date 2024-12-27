<script setup lang="ts">
import type { CountryCode } from '@@/types/shopify';

// Stores
const appStore = useAppStore();
const cartStore = useCartStore();
const shopStore = useShopStore();

// Shop data
const countries = shopStore.locale?.availableCountries;
const countryCode = shopStore.locale?.country?.isoCode;

// State
const countryLocale = ref<CountryCode>(countryCode);
const isLoading = ref(false);

// Actions
const closeModal = () => {
  appStore.localeModalOpen = false;
};

// Update localization
const updateLocalization = async () => {
  isLoading.value = true;

  await Promise.all([
    cartStore.attachBuyer({ countryCode: countryLocale.value }),
    shopStore.getLocalization(countryLocale.value)
  ]);

  isLoading.value = false;
  closeModal();
};

// Watchers
const route = useRoute();
const { escape } = useMagicKeys();

watch(
  () => route.path,
  () => {
    closeModal();
  }
);

if (escape) {
  watch(escape, () => {
    closeModal();
  });
}
</script>

<template>
  <Transition name="bg-fade" mode="out-in" appear>
    <section
      v-if="appStore.localeModalOpen"
      class="fixed inset-0 z-[200] bg-black/50"
      @click="closeModal"
    />
  </Transition>
  <Transition name="scale-in" mode="out-in" appear>
    <div
      v-if="appStore.localeModalOpen"
      class="fixed left-[50%] top-[50%] w-full max-w-xl translate-x-[-50%] translate-y-[-50%] p-6 z-[200] bg-white"
    >
      <h2 class="text-center">Select Country</h2>
      <form class="flex flex-col my-6" @submit.prevent="updateLocalization">
        <div class="relative w-full mb-2.5">
          <select
            id="country"
            v-model="countryLocale"
            name="countryLocale"
            class="flex w-full py-2 px-3.5 normal-case bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-black focus:outline focus:outline-1 focus:outline-black"
          >
            <option
              v-for="country in countries"
              :key="country.isoCode"
              :value="country.isoCode"
            >
              {{ country.name }} ({{ country.currency.isoCode }} {{ country.currency.symbol }})
            </option>
          </select>
          <span class="absolute inset-y-0 end-0 flex items-center pointer-events-none px-2.5">
            <Icon name="ph:caret-up-down" class="h-4 w-4 shrink-0" />
          </span>
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="flex items-center justify-center p-2 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          {{ isLoading ? 'Saving...' : 'Save' }}
        </button>
      </form>
      <p class="max-w-[75%] mx-auto text-sm leading-snug text-center">
        Shop in your local currency · Enjoy local shipping rates at checkout
      </p>
      <button
        class="flex absolute top-2 right-2 ring-1 ring-transparent ring-offset-2 rounded-sm focus:ring-black"
        @click="closeModal"
      >
        <Icon name="ph:x" class="h-5 w-5 shrink-0" />
      </button>
    </div>
  </Transition>
</template>

<style lang="css" scoped>
.bg-fade-enter-active,
.bg-fade-leave-active {
  @apply opacity-100;
  @apply transition duration-200 ease-out;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  @apply opacity-0;
  @apply transition duration-200 ease-out;
}

.scale-in-enter-active,
.scale-in-leave-active {
  @apply opacity-100;
  @apply transform scale-100;
  @apply transition duration-200 ease-out delay-100;
}

.scale-in-enter-from,
.scale-in-leave-to {
  @apply opacity-0;
  @apply transform scale-[.99];
  @apply transition duration-200 ease-out delay-0;
}
</style>
