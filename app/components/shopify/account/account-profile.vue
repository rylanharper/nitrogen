<script setup lang="ts">
import type { CustomerFragment } from '#shopify/customer-account'

// Props
const props = defineProps<{
  customer: CustomerFragment
}>()

// Computed
const address = computed(() => props.customer.defaultAddress)
</script>

<template>
  <section class="flex flex-col gap-4 mb-10">
    <h2 class="uppercase">
      Profile
    </h2>
    <dl class="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      <div class="flex flex-col gap-0.5">
        <dt class="text-zinc-500 uppercase">
          Name
        </dt>
        <dd>{{ props.customer.displayName || '—' }}</dd>
      </div>
      <div class="flex flex-col gap-0.5">
        <dt class="text-zinc-500 uppercase">
          Email
        </dt>
        <dd>{{ props.customer.emailAddress?.emailAddress || '—' }}</dd>
      </div>
      <div class="flex flex-col gap-0.5">
        <dt class="text-zinc-500 uppercase">
          Phone
        </dt>
        <dd>{{ props.customer.phoneNumber?.phoneNumber || '—' }}</dd>
      </div>
      <div class="flex flex-col gap-0.5">
        <dt class="text-zinc-500 uppercase">
          Default Address
        </dt>
        <dd>{{ address?.formatted?.join(', ') || '—' }}</dd>
      </div>
    </dl>
  </section>
</template>
