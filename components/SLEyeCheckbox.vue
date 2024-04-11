<template lang="pug">
.eye-checkbox(:class="checkboxClass")
  input(
      type="checkbox"
      :id="uid"
      :checked="isChecked"
      :value="value"
      :disabled="disabled"
      @change="onChanged"
    )
  label(:for="uid")
    .status-icon
      SLIcon(icon="eye-slash")
      SLIcon(icon="eye")
    slot
      span(v-if="label !== ''") {{ label }}
</template>

<script lang="ts">
import { isEqual } from "lodash-es";
import { getUID } from "~ui/utils";

export default defineComponent({
  name: "SLEyeCheckbox",
  components: {},
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: [Number, String, Boolean, Object],
      default: true,
    },
    modelValue: {
      type: [Number, String, Boolean, Array],
      default: false,
    },
    trueValue: {
      type: [Number, String, Boolean],
      default: true,
    },
    falseValue: {
      type: [Number, String, Boolean],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "",
      validator: (value: string) => ["", "sm"].includes(value),
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { disabled, size, modelValue, value, trueValue, falseValue } =
      toRefs(props);

    const uid = ref<string | undefined>(undefined);

    const checkboxClass = computed(() => {
      if (size.value === "") return "";

      return `checkbox-${size.value}`;
    });
    const isChecked = computed(() => {
      if (Array.isArray(modelValue.value)) {
        let found = false;
        modelValue.value.forEach((v) => {
          if (isEqual(v, value.value)) {
            found = true;
          }
        });
        return found;
      }
      return modelValue.value === trueValue.value;
    });

    function onChanged(e: Event) {
      if (disabled.value) {
        return;
      }

      const isChecked = (e.target as HTMLInputElement).checked;

      if (Array.isArray(modelValue.value)) {
        let newValue = [...modelValue.value];

        if (isChecked) {
          newValue.push(value.value);
        } else {
          newValue = newValue.filter((v) => !isEqual(v, value.value));
        }

        emit("update:modelValue", newValue);
      } else {
        emit(
          "update:modelValue",
          isChecked ? trueValue.value : falseValue.value
        );
      }
    }

    onMounted(() => {
      uid.value = getUID();
    });

    return {
      uid,
      checkboxClass,
      isChecked,
      onChanged,
    };
  },
});
</script>

<style lang="stylus">
.eye-checkbox
  @apply inline-block relative text-base align-top overflow-hidden

  &.checkbox-sm
    @apply text-sm

    label
      @apply text-sm

  input
    @apply absolute s('-top-10') s('-left-10')

  label
    @apply relative inline-flex items-center text-base text-gray-2 cursor-pointer

    .icon
      @apply hidden text-primary

    span
      @apply ml-2

  input:checked + label
    .icon-eye
      @apply inline-block

  input:not(:checked) + label
    .icon-eye-slash
      @apply inline-block

  input:not(:checked):disabled + label
    @apply text-gray-4 cursor-default

    .icon-eye-slash
      @apply inline-block text-gray-4

  input:checked:disabled + label
    @apply text-gray-3 cursor-default

    .icon-eye
      @apply inline-block text-gray-3
</style>
