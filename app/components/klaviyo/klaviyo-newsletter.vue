<script setup lang="ts">
import { isEmail } from '@/utils/validators'

// State
const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Klaviyo
const klaviyo = useKlaviyo()
const listId = 'StGPx7'

// Subscribe
const handleNewsletter = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  if (!isEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.'
    isLoading.value = false
    return
  }

  try {
    await klaviyo.subscribe.newsletter(email.value, listId)
    successMessage.value = 'You have successfully subscribed!'
  } catch (error: any) {
    errorMessage.value = `${error.message}. Please try again later.`
  } finally {
    email.value = ''
    isLoading.value = false
  }
}

// Composables
const route = useRoute()

// Watchers
watch(
  () => route.fullPath,
  () => {
    errorMessage.value = ''
    successMessage.value = ''
  },
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <h3 class="uppercase">
      Newsletter
      <span class="normal-case">
        (Klaviyo)
      </span>
    </h3>
    <form
      novalidate
      @submit.prevent="handleNewsletter"
    >
      <div class="relative w-full mb-2.5">
        <input
          id="email"
          v-model="email"
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
      <button
        type="submit"
        :disabled="isLoading"
        class="flex items-center justify-center p-2 px-4 bg-zinc-100 border border-zinc-300 rounded-md transition-colors duration-200 ease-out hover:bg-zinc-200"
      >
        <span class="uppercase whitespace-nowrap">
          {{ isLoading ? 'Subscribing...' : 'Subscribe' }}
        </span>
      </button>
    </form>
    <p
      v-if="errorMessage || successMessage"
      :class="errorMessage ? 'text-red-500' : 'text-blue-700'"
    >
      {{ errorMessage || successMessage }}
    </p>
  </div>
</template>
