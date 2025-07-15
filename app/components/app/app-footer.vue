<script setup lang="ts">
// Links
const footerLinks1 = [
  { label: 'About', path: '/collections/latest' },
  { label: 'Campaigns', path: '/collections/latest' },
  { label: 'Contact', path: '/collections/latest' }
];

const footerLinks2 = [
  { label: 'FAQ', path: '/collections/latest' },
  { label: 'Shipping & Returns', path: '/collections/latest' },
  { label: 'Privacy Policy', path: '/collections/latest' },
  { label: 'Payments', path: '/collections/latest' },
];

const footerLinks3 = [
  { label: 'Instagram', path: '/collections/latest' },
  { label: 'Tiktok', path: '/collections/latest' },
  { label: 'Github', path: '/collections/latest' }
];
</script>

<template>
  <footer class="relative bg-white border-t border-zinc-300">
    <nav class="hidden flex-col p-6 gap-32 lg:flex">
      <div class="grid grid-cols-4 gap-10">
        <div class="flex flex-col max-w-fit">
          <h3 class="uppercase mb-4">Company</h3>
          <NuxtLink
            v-for="link in footerLinks1"
            :key="link.label"
            :to="link.path"
            class="hover:text-gray-500"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="flex flex-col max-w-fit">
          <h3 class="uppercase mb-4">Support</h3>
          <NuxtLink
            v-for="link in footerLinks2"
            :key="link.label"
            :to="link.path"
            class="hover:text-gray-500"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="flex flex-col max-w-fit">
          <h3 class="uppercase mb-4">Connect</h3>
          <NuxtLink
            v-for="link in footerLinks3"
            :key="link.label"
            :to="link.path"
            class="hover:text-gray-500"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
        <KlaviyoNewsletter />
      </div>
      <div class="flex justify-between">
        <span class="uppercase text-sm">© Nitrogen 2025</span>
      </div>
    </nav>
    <nav class="flex flex-col p-6 gap-8 lg:hidden">
      <KlaviyoNewsletter />
      <div class="flex flex-col divide-y divide-zinc-300">
        <details class="group">
          <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span class="uppercase truncate">Company</span>
            <Icon
              name="ph:caret-down"
              class="size-5 shrink-0 transition group-open:rotate-180"
            />
          </summary>
          <div class="h-0 overflow-hidden group-open:h-auto">
            <div class="flex flex-col pb-4">
              <NuxtLink
                v-for="link in footerLinks1"
                :key="link.label"
                :to="link.path"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </details>
        <details class="group">
          <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span class="uppercase truncate">Support</span>
            <Icon
              name="ph:caret-down"
              class="size-5 shrink-0 transition group-open:rotate-180"
            />
          </summary>
          <div class="h-0 overflow-hidden group-open:h-auto">
            <div class="flex flex-col pb-4">
              <NuxtLink
                v-for="link in footerLinks2"
                :key="link.label"
                :to="link.path"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </details>
        <details class="group">
          <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span class="uppercase truncate">Connect</span>
            <Icon
              name="ph:caret-down"
              class="size-5 shrink-0 transition group-open:rotate-180"
            />
          </summary>
          <div class="h-0 overflow-hidden group-open:h-auto">
            <div class="flex flex-col pb-4">
              <NuxtLink
                v-for="link in footerLinks3"
                :key="link.label"
                :to="link.path"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </details>
      </div>
      <div class="flex justify-between">
        <span class="uppercase text-sm">© Nitrogen 2025</span>
      </div>
    </nav>
  </footer>
</template>
