<template lang="pug">
.checkbox(:class='checkboxClass')
  input(
    type='checkbox',
    :id='uid',
    :checked='isChecked',
    :value='value',
    :disabled='disabled',
    @change='onChanged'
  )
  label(:for='uid', :class='{ "is-check-some": isCheckSome }')
    SLIcon.icon-square(:icon='falseIcon')
    SLIcon.icon-check-square(:icon='trueIcon')
    SLIcon.icon-minus-square(icon='minus-square')
    slot
      span(v-if='label !== ""') {{ label }}
</template>

<script lang="ts">
import isEqual from "lodash/isEqual";
import { getUID } from "~ui/utils";

export default defineComponent({
  name: "SLCheckbox",
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
    trueIcon: {
      type: String,
      default: "check-square",
    },
    falseIcon: {
      type: String,
      default: "square",
    },
    isCheckSome: {
      type: Boolean,
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
    const { size, disabled, modelValue, trueValue, falseValue, value } =
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
          newValue = newValue.filter((v) => v !== value.value);
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
.checkbox
  @apply inline-flex relative text-base align-top overflow-hidden

  &.checkbox-sm
    @apply text-sm

    label
      @apply text-sm

  input
    @apply absolute s("-top-10") s("-left-10")

  label
    @apply relative text-base text-gray-3 cursor-pointer

    .icon
      @apply hidden

    span
      @apply ml-2

  input:not(:checked) + label:not(.is-check-some)
    .icon-square
      @apply inline-block

  input:not(:checked) + label.is-check-some
    @apply text-primary

    .icon-square
      @apply hidden

    .icon-minus-square
      @apply inline-block

  input:checked + label, &.is-check-some
    @apply text-primary

  input:checked + label
    .icon-check-square
      @apply inline-block

  input:not(:checked):disabled + label
    @apply text-gray-4 cursor-default

  input:checked:disabled + label
    @apply text-gray-3 cursor-default
</style>
