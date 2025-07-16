<script setup lang="ts">
import type { CountryCode } from '@@/types/shopify-storefront';

import { useMagicKeys } from '@vueuse/core';

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

// Actions
const closeModal = () => {
  appStore.toggle('localeModal', false);
};

// Watchers
const route = useRoute()
const { escape } = useMagicKeys()

watch(() => route.path, closeModal)

if (escape) {
  watch(escape, closeModal)
}
</script>

<template>
  <Transition name="bg-fade">
    <section
      v-if="appStore.localeModal"
      class="fixed inset-0 z-200 bg-black/50 pointer-events-auto"
      @click="closeModal"
    />
  </Transition>
  <Transition name="fade-up">
    <div
      v-if="appStore.localeModal"
      class="fixed flex items-center justify-center size-full inset-0 z-200 pointer-events-none"
    >
      <dialog class="relative flex flex-col p-6 bg-white pointer-events-auto md:w-xl">
        <h2 class="uppercase text-center">Select Country</h2>
        <form class="flex flex-col my-6" @submit.prevent="updateLocalization">
          <div class="relative w-full mb-2.5">
            <select
              id="country"
              v-model="countryLocale"
              name="countryLocale"
              class="flex w-full py-2 px-3.5 bg-white border border-zinc-300 rounded-md appearance-none placeholder:text-black focus:outline-1 focus:outline-black"
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
              <Icon name="ph:caret-up-down" class="size-4 shrink-0" />
            </span>
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 hover:bg-zinc-200"
          >
            <span>{{ isLoading ? 'Saving...' : 'Save' }}</span>
          </button>
        </form>
        <p class="max-w-[75%] mx-auto uppercase text-sm leading-snug text-center">
          Shop in your local currency · Enjoy local shipping rates at checkout
        </p>
        <button
          class="flex absolute top-2 right-2 ring-1 ring-transparent ring-offset-2 rounded-xs focus:ring-black"
          @click="closeModal"
        >
          <Icon
            name="ph:x"
            class="inline-block shrink-0 !size-5"
          />
        </button>
      </dialog>
    </div>
  </Transition>
</template>

<style scoped>
@reference "tailwindcss";

.bg-fade-enter-active,
.bg-fade-leave-active {
  @apply transition duration-200 ease-out;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  @apply opacity-0;
}

.bg-fade-enter-to,
.bg-fade-leave-from {
  @apply opacity-100;
}

.fade-up-enter-active,
.fade-up-leave-active {
  @apply transition duration-200 ease-out;
}

.fade-up-enter-from,
.fade-up-leave-to {
  @apply opacity-0 transform translate-y-2 delay-0;
}

.fade-up-enter-to,
.fade-up-leave-from {
  @apply opacity-100 transform translate-y-0 delay-100;
}
</style>
