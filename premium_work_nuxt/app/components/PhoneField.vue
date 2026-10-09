<template>
  <div class="min-w-0 text-sm font-bold">
    <label :for="`${uid}-phone`">{{ t("clientForm.phone") }}<template v-if="required"> *</template><template v-else> {{ t("clientForm.optional") }}</template></label>
    <div
      class="relative flex items-end gap-3"
      @keydown="onKeydown"
    >
      <input type="hidden" name="phone_country" :value="phone.country.value" />
      <button
        ref="triggerRef"
        type="button"
        :disabled="disabled"
        :aria-label="`${t('clientForm.countryOf')} ${selected.name} ${selected.dial}`"
        :aria-expanded="open"
        :aria-controls="`${uid}-countries`"
        aria-haspopup="dialog"
        class="flex min-h-12 shrink-0 items-center gap-2 border-b border-[#131313]/30 px-1 font-normal"
        @click="open = !open; search = ''"
        @blur="onTriggerBlur"
      >
        <img :src="`/images/flags/3x2/${phone.country.value}.svg`" :alt="selected.name" aria-hidden="true" class="h-4 w-6" />
        {{ selected.dial }} <span aria-hidden="true">▾</span>
      </button>
      <input
        :id="`${uid}-phone`"
        :required="required"
        name="phone"
        type="tel"
        autocomplete="tel-national"
        :maxlength="30"
        :value="phone.number.value"
        :disabled="disabled"
        :aria-invalid="ariaInvalid"
        :aria-describedby="ariaDescribedby"
        :class="`${field} min-w-0`"
        @input="onNumberInput"
      />
      <div
        v-if="open"
        :id="`${uid}-countries`"
        role="dialog"
        :aria-label="t('clientForm.selectCountry')"
        class="absolute left-0 top-full z-30 mt-2 w-full min-w-64 rounded-xl border border-[#e5e7eb] bg-white p-3 text-[#131313] shadow-xl"
      >
        <input
          ref="searchRef"
          type="search"
          :aria-label="t('clientForm.searchCountry')"
          :placeholder="t('clientForm.searchCountry')"
          :value="search"
          class="mb-2 w-full rounded border border-[#131313]/30 bg-transparent p-2 font-normal"
          @input="search = ($event.target as HTMLInputElement).value"
        />
        <ul class="max-h-52 overflow-y-auto">
          <li v-for="country in filtered" :key="country.code">
            <button
              type="button"
              :aria-pressed="country.code === phone.country.value"
              class="flex min-h-11 w-full items-center gap-3 rounded px-2 py-2 text-left font-normal hover:bg-[#f6f6f6] focus-visible:bg-[#f6f6f6]"
              @click="selectCountry(country.code)"
            >
              <img :src="`/images/flags/3x2/${country.code}.svg`" :alt="country.name" aria-hidden="true" class="h-4 w-6 shrink-0" />
              <span class="flex-1">{{ country.name }}</span><span>{{ country.dial }}</span>
            </button>
          </li>
        </ul>
        <p v-if="!filtered.length" class="py-3 font-normal">{{ t("clientForm.noCountries") }}</p>
      </div>
    </div>
    <slot name="error" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import type { PhoneValue } from "~/composables/usePhoneValue";

const { t, lang } = useLang();

const props = defineProps<{
  phone: PhoneValue;
  required?: boolean;
  disabled?: boolean;
  field: string;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
}>();

const uid = `pf-${Math.random().toString(36).slice(2, 9)}`;
const open = ref(false);
const search = ref("");
const triggerRef = ref<HTMLButtonElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);

const regionNames = new Intl.DisplayNames([lang.value], { type: "region" });
const countries = getCountries()
  .map((code) => ({ code, name: regionNames.of(code) || code, dial: `+${getCountryCallingCode(code)}` }))
  .sort((a, b) => a.name.localeCompare(b.name, lang.value));

const selected = computed(() => countries.find((c) => c.code === props.phone.country.value) ?? countries[0]!);

const filtered = computed(() => {
  const q = search.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return countries.filter((c) =>
    `${c.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")} ${c.dial}`.toLowerCase().includes(q)
  );
});

function onNumberInput(event: Event) {
  const next = (event.target as HTMLInputElement).value;
  if (/^(\+|00)/.test(next)) props.phone.importValue(next);
  else props.phone.setNumber(next);
}

function selectCountry(code: CountryCode) {
  props.phone.setCountry(code);
  open.value = false;
  triggerRef.value?.focus();
}

function onTriggerBlur(event: FocusEvent) {
  // Cierra el desplegable solo si el foco sale del contenedor
  const container = (event.target as HTMLElement).closest(".relative");
  nextTick(() => {
    if (container && !container.contains(document.activeElement)) open.value = false;
  });
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    open.value = false;
    triggerRef.value?.focus();
  }
}
</script>
