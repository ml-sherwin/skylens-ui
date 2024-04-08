<template lang="pug">
.pill-checkbox(:class="pillClass")
  input(
      type="checkbox"
      :id="uid"
      :checked="isChecked"
      :value="value"
      :disabled="disabled"
      @change="onChanged"
    )
  label(:for="uid")
    span {{ label }}
    SLIcon(v-if="icon" :icon="icon")
</template>

<script lang="ts">
import type { PropType } from "vue";
import isEqual from "lodash/isEqual";
import { getUID } from "~ui/utils";

export default defineComponent({
  name: "SLPillCheckbox",
  components: {},
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: [Number, String, Boolean, Object] as PropType<
        number | string | boolean | object
      >,
      default: true,
    },
    modelValue: {
      type: [Number, String, Boolean, Array] as PropType<
        number | string | boolean | Array<any>
      >,
      default: false,
    },
    trueValue: {
      type: [Number, String, Boolean] as PropType<number | string | boolean>,
      default: true,
    },
    falseValue: {
      type: [Number, String, Boolean] as PropType<number | string | boolean>,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: "",
      validator: (value: string) => ["", "xs"].includes(value),
    },
    color: {
      type: String,
      default: "",
      validator: (value: string) =>
        [
          "",
          "third",
          "third-7",
          "primary",
          "primary-hover",
          "secondary-line",
          "blue-1",
          "blue-2",
          "secondary-new-300",
        ].includes(value),
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { size, color, modelValue, value, trueValue, falseValue, disabled } =
      toRefs(props);

    const uid = ref<string | undefined>(undefined);

    const pillClass = computed(() => {
      const classes = [];
      if (size.value && size.value !== "") {
        classes.push(`pill-checkbox-${size.value}`);
      }

      if (color.value && color.value !== "") {
        classes.push(`pill-checkbox-${color.value}`);
      }
      return classes.join(" ");
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
      pillClass,
      isChecked,
      onChanged,
    };
  },
});
</script>

<style lang="stylus">
.pill-checkbox
  @apply inline-block relative

  &.pill-checkbox-xs
    label
      @apply py-px text-xs

  &.pill-checkbox-third
    input:checked + label
      @apply bg-third border-third

  &.pill-checkbox-third-7
    input:checked + label
      @apply bg-third-7 border-third-7

  &.pill-checkbox-primary
    input:checked + label
      @apply bg-primary border-primary

  &.pill-checkbox-primary-hover
    input:checked + label
      @apply bg-primary-hover border-primary-hover

  &.pill-checkbox-secondary-line
    input:checked + label
      @apply bg-secondary-line border-secondary-line

  &.pill-checkbox-blue-1
    input:checked + label
      @apply bg-blue-1 border-blue-1

  &.pill-checkbox-blue-2
    input:checked + label
      @apply bg-blue-2 border-blue-2

  &.pill-checkbox-secondary-new-300
    input:checked + label
      @apply bg-secondary-new-300 border-secondary-new-300

  input
    @apply absolute s('left-1/2') s('top-1/2') transform s('-translate-x-1/2') s('-translate-y-1/2')

  label
    @apply inline-flex justify-center items-center relative s('px-1.75') s('py-0.75')
    @apply bg-white border border-primary-lighter rounded-full text-sm s('leading-4.75') text-gray-2 align-top cursor-pointer

    .icon
      @apply hidden ml-2

  input:checked + label
    @apply bg-white border-white text-white font-bold

    .icon
      @apply inline-block

  input:disabled + label
    @apply bg-white border-cancel text-gray-4 font-normal cursor-default
</style>
