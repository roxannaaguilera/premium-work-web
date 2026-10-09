<template>
  <div class="sm:col-span-2">
    <label class="flex items-start gap-3 text-sm leading-6">
      <input
        required
        type="checkbox"
        name="consent"
        :checked="modelValue"
        :aria-invalid="ariaInvalid"
        :aria-describedby="ariaDescribedby"
        class="mt-1.5 h-4 w-4 shrink-0 accent-[#131313]"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <span>{{ consentText }} *
        <a href="/politica-de-privacidad" class="underline underline-offset-2">{{ t("clientForm.privacyPolicy") }}</a>
      </span>
    </label>
    <slot name="error" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { t } = useLang();

const props = defineProps<{
  candidate?: boolean;
  modelValue: boolean;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const consentText = computed(() => props.candidate ? t("candidateForm.consent") : t("clientForm.consent"));
</script>
