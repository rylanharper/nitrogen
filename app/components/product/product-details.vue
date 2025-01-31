<script setup lang="ts">
// Props
const props = defineProps<{
  description: string;
  details: any;
  shipping: any;
}>();

const renderNode = (node: any): string => {
  if (!node) return '';

  // Handle text nodes
  if (node.type === 'text') {
    return node.value;
  }

  // Handle links
  if (node.type === 'link') {
    const childContent = node.children?.map(renderNode).join('') || '';
    return `<a href="${node.url}" class="underline decoration-dotted decoration-1 underline-offset-[3px] hover:text-gray-500">${childContent}</a>`;
  }

  // Handle paragraphs
  if (node.type === 'paragraph') {
    const childContent = node.children?.map(renderNode).join('') || '';
    return `<p>${childContent}</p>`;
  }

  // Handle lists
  if (node.type === 'list') {
    const tag = node.listType === 'ordered' ? 'ol' : 'ul';
    const childContent = node.children?.map(renderNode).join('') || '';
    return `<${tag} class="list-disc list-inside">${childContent}</${tag}>`;
  }

  // Handle list items
  if (node.type === 'list-item') {
    const childContent = node.children?.map(renderNode).join('') || '';
    return `<li>${childContent}</li>`;
  }

  // Recursively handle any children
  if (node.children) {
    return node.children.map(renderNode).join('');
  }

  return '';
};

const parseContent = (content: string | object) => {
  try {
    const data = typeof content === 'string' ? JSON.parse(content) : content;
    return renderNode(data);
  } catch (error) {
    console.error('Error parsing content:', error);
    return '<p class="text-red-500">There was an error rendering the content.</p>';
  }
};

// Computed
const detailsContent = computed(() => parseContent(props.details));
const shippingContent = computed(() => parseContent(props.shipping));
</script>

<template>
  <div class="flex flex-col divide-y divide-zinc-300">
    <details name="info" class="group">
      <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span class="truncate uppercase">Description</span>
        <Icon
          name="ph:caret-down"
          class="size-5 shrink-0 transition group-open:rotate-180"
        />
      </summary>
      <div class="h-0 overflow-hidden group-open:h-auto">
        <div class="flex flex-col pb-4">
          <article v-if="props.description" v-html="props.description" />
          <p v-else class="text-gray-500">Description not available.</p>
        </div>
      </div>
    </details>
    <details name="info" class="group">
      <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span class="truncate uppercase">Details</span>
        <Icon
          name="ph:caret-down"
          class="size-5 shrink-0 transition group-open:rotate-180"
        />
      </summary>
      <div class="h-0 overflow-hidden group-open:h-auto">
        <div class="flex flex-col pb-4">
          <article v-if="detailsContent" v-html="detailsContent" />
          <p v-else class="text-gray-500">Details not available.</p>
        </div>
      </div>
    </details>
    <details name="info" class="group">
      <summary class="flex items-center justify-between py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span class="truncate uppercase">Shipping</span>
        <Icon
          name="ph:caret-down"
          class="size-5 shrink-0 transition group-open:rotate-180"
        />
      </summary>
      <div class="h-0 overflow-hidden group-open:h-auto">
        <div class="flex flex-col">
          <article v-if="shippingContent" v-html="shippingContent" />
          <p v-else class="text-gray-500">Shipping information not available.</p>
        </div>
      </div>
    </details>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

:deep(p:not(:last-child)) {
  @apply mb-3.5;
}
</style>
