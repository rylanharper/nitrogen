<script setup lang="ts">
import type { MailingAddressFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  defaultAddress: MailingAddressFragment;
  addresses: MailingAddressFragment[];
}>();

// Stores
const authStore = useAuthStore();

// State
const errorMessage = ref('');
const isLoading = ref(false);

// Computed
const filteredAddresses = computed(() => [
  props.defaultAddress,
  ...props.addresses.filter((address) => address.id !== props.defaultAddress.id)
]);

// Shopify
const shopify = useShopify();

// Delete address
const handleAddressDelete = async (addressId: string) => {
  isLoading.value = true

  try {
    await shopify.customer.deleteAddress({
      id: addressId,
      customerAccessToken: authStore.accessToken
    });

    reloadNuxtApp();
  } catch (error: any) {
    console.error('Cannot delete customer address:', error.message);
    errorMessage.value = 'We couldn’t delete your address. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="grid grid-flow-row gap-x-4 gap-y-8 lg:grid-cols-2 lg:gap-y-10">
    <div
      v-for="(address, index) in filteredAddresses"
      :key="index"
      class="flex flex-col gap-4"
    >
      <div class="border border-zinc-300 rounded-lg overflow-hidden">
        <div
          class="flex items-center justify-between px-6 py-2.5 bg-zinc-50 border-b border-zinc-300"
        >
          <h3 class="text-sm">
            {{ address.id === props.defaultAddress.id ? 'Default Address' : `Address ${index}`}}
          </h3>
        </div>
        <div class="flex flex-col px-6 py-2.5">
          <span v-for="(line, lineIndex) in address.formatted" :key="lineIndex">
            {{ line }}
          </span>
        </div>
      </div>
      <div class="flex gap-3">
        <NuxtLink
          :to="`/account/addresses/edit?id=${encodeURIComponent(address.id)}}`"
          class="flex items-center justify-center p-2 px-4 text-normalize bg-zinc-100 border border-zinc-300 rounded-md transition duration-200 ease-in-out hover:bg-zinc-200"
        >
          Edit Address
        </NuxtLink>
        <button
          class="flex items-center justify-center p-2 px-4 text-normalize text-red-600 bg-red-50 border border-red-300 rounded-md transition duration-200 ease-in-out hover:bg-red-100"
          @click="handleAddressDelete(address.id)"
        >
          Delete Address
        </button>
      </div>
    </div>
    <NuxtLink
      :to="{ name: 'account-addresses-add' }"
      class="flex items-center justify-center gap-2 h-[8.45rem] text-normalize bg-line-pattern border border-dashed border-zinc-300 rounded-lg transition duration-200 ease-in-out hover:bg-zinc-50"
    >
      <Icon name="ph:map-pin-plus" class="h-6 w-6 shrink-0" />
      Add New Addresses
    </NuxtLink>
  </div>
</template>
