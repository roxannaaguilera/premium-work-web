<template>
  <form
    ref="formRef"
    novalidate
    class="integrated-form"
    :aria-busy="busy"
    @blur="validation.onBlur"
    @change="validation.onChange"
    @submit.prevent="submit"
  >
    <p class="mb-4 text-sm text-[#4a5264]">{{ t("clientForm.requiredNote") }}</p>
    <fieldset :disabled="busy" class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      <label class="text-sm font-bold">{{ t("clientForm.name") }} *
        <input required name="name" v-bind="validation.props('name')" autocomplete="name" :maxlength="200" :class="field" />
        <FieldError :id="validation.errorId('name')" :message="validation.errors.value.name" />
      </label>
      <label class="text-sm font-bold">{{ t("clientForm.company") }} *
        <input required name="company" v-bind="validation.props('company')" autocomplete="organization" :maxlength="200" :class="field" />
        <FieldError :id="validation.errorId('company')" :message="validation.errors.value.company" />
      </label>
      <label class="text-sm font-bold">{{ t("clientForm.email") }} *
        <input required type="email" name="email" v-bind="validation.props('email')" autocomplete="email" :maxlength="200" :class="field" />
        <FieldError :id="validation.errorId('email')" :message="validation.errors.value.email" />
      </label>
      <PhoneField
        :phone="phone"
        :disabled="busy"
        :field="field"
        :aria-invalid="validation.props('phone')['aria-invalid']"
        :aria-describedby="validation.props('phone')['aria-describedby']"
      >
        <template #error>
          <FieldError :id="validation.errorId('phone')" :message="validation.errors.value.phone" />
        </template>
      </PhoneField>
      <label class="text-sm font-bold">{{ t("clientForm.sector") }} *
        <select required name="sector" v-model="sector" v-bind="validation.props('sector')" :class="field">
          <option value="">{{ t("clientForm.selectSector") }}</option>
          <option v-for="(label, value) in sectorLabels(lang)" :key="value" :value="value">{{ label }}</option>
        </select>
        <FieldError :id="validation.errorId('sector')" :message="validation.errors.value.sector" />
      </label>
      <label class="text-sm font-bold">{{ t("clientForm.service") }} *
        <select required name="service" v-model="service" v-bind="validation.props('service')" :class="field">
          <option value="">{{ t("clientForm.selectService") }}</option>
          <option v-for="(label, value) in serviceLabels(lang)" :key="value" :value="value">{{ label }}</option>
        </select>
        <FieldError :id="validation.errorId('service')" :message="validation.errors.value.service" />
      </label>
      <CityField
        v-model="city"
        :label="t('clientForm.city')"
        :select-label="t('clientForm.selectCity')"
        :field="field"
        :aria-invalid="validation.props('city')['aria-invalid']"
        :aria-describedby="validation.props('city')['aria-describedby']"
      >
        <template #error>
          <FieldError :id="validation.errorId('city')" :message="validation.errors.value.city" />
        </template>
      </CityField>
      <label class="text-sm font-bold">{{ t("clientForm.eventDate") }} {{ t("clientForm.optional") }}
        <input type="date" name="event_date" v-bind="validation.props('event_date')" :class="field" />
        <FieldError :id="validation.errorId('event_date')" :message="validation.errors.value.event_date" />
      </label>
      <label class="text-sm font-bold">{{ t("clientForm.staffCount") }} {{ t("clientForm.optional") }}
        <input type="number" min="1" max="10000" step="1" name="staff_count" v-bind="validation.props('staff_count')" :class="field" />
        <FieldError :id="validation.errorId('staff_count')" :message="validation.errors.value.staff_count" />
      </label>
      <label class="text-sm font-bold">{{ t("clientForm.budget") }} {{ t("clientForm.optional") }}
        <input type="number" min="0" max="100000000" step="0.01" name="budget" v-bind="validation.props('budget')" :class="field" />
        <FieldError :id="validation.errorId('budget')" :message="validation.errors.value.budget" />
      </label>
      <label class="text-sm font-bold sm:col-span-2">{{ t("clientForm.message") }} *
        <textarea required name="message" v-bind="validation.props('message')" :rows="3" :maxlength="5000" :class="field" />
        <FieldError :id="validation.errorId('message')" :message="validation.errors.value.message" />
      </label>
      <FormConsent
        v-model="consent"
        :aria-invalid="validation.props('consent')['aria-invalid']"
        :aria-describedby="validation.props('consent')['aria-describedby']"
      >
        <template #error>
          <FieldError :id="validation.errorId('consent')" :message="validation.errors.value.consent" />
        </template>
      </FormConsent>
      <button
        type="submit"
        class="rounded-full bg-[#131313] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#2b2b2b] disabled:opacity-60 sm:col-span-2"
      >
        {{ busy ? t("clientForm.saving") : t("clientForm.submit") }}
      </button>
    </fieldset>
    <p :role="success ? 'status' : 'alert'" class="mt-4 text-sm text-[#131313]">{{ status }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { submitForm } from "~/utils/submit-form";
import { sectorLabels, serviceLabels } from "~/utils/service-options";
import { useFormValidation } from "~/composables/useFormValidation";
import { usePhoneValue } from "~/composables/usePhoneValue";

const props = withDefaults(defineProps<{ sector?: string; service?: string }>(), {
  sector: "",
  service: "",
});

const { t, lang } = useLang();
const phone = usePhoneValue();
const validation = useFormValidation("client");

const formRef = ref<HTMLFormElement | null>(null);
const busy = ref(false);
const status = ref("");
const success = ref(false);
const sector = ref(props.sector);
const service = ref(props.service);
const city = ref("");
const consent = ref(false);

const field = "mt-2 w-full border-b border-[#131313]/30 bg-transparent py-3 font-normal outline-none focus:border-[#173aab]";

async function submit() {
  const form = formRef.value;
  if (!form || busy.value) return;
  success.value = false;
  status.value = "";
  if (!validation.validate(form)) {
    status.value = t("clientForm.reviewFields");
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  busy.value = true;
  success.value = false;
  status.value = "";
  try {
    const result = await submitForm("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (result.errors) validation.setErrors(result.errors);
    if (result.error) throw new Error(result.error);
    success.value = true;
    status.value = t("clientForm.received");
    form.reset();
    phone.clear();
    sector.value = "";
    service.value = "";
    city.value = "";
    consent.value = false;
    validation.setErrors({});
  } catch (error) {
    status.value = error instanceof Error ? error.message : t("clientForm.connectError");
  } finally {
    busy.value = false;
  }
}
</script>
