<template>
  <label class="text-sm font-bold">{{ label }} *
    <select
      required
      name="city"
      autocomplete="address-level2"
      :value="modelValue"
      :aria-invalid="ariaInvalid"
      :aria-describedby="ariaDescribedby"
      :class="field"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">{{ selectLabel }}</option>
      <option v-for="city in spanishCities" :key="city" :value="city">{{ city }}</option>
    </select>
    <slot name="error" />
  </label>
</template>

<script setup lang="ts">
import { spanishCities } from "~/utils/contact-options";

defineProps<{
  label: string;
  selectLabel: string;
  field: string;
  modelValue: string;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
