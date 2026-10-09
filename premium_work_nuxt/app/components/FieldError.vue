<template>
  <span v-if="message" :id="id" class="mt-2 block text-sm font-normal text-red-700">{{ message }}</span>
</template>

<script setup lang="ts">
defineProps<{ id: string; message?: string }>();
</script>
