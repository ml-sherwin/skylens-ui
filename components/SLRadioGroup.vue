<template lang="pug">
SLElementWithTitle(:title='disabled ? disabledHint : ""')
  .radio-group(:class='sizeClass')
    .radio(v-for="option, i in options")
      input(
          type="radio"
          :id="uids[i]"
          :checked="modelValue === option.value"
          :disabled="disabled"
        )
      label(@click="onClickedRadio(option.value)")
        span(v-if='option.label') {{ option.label }}
        SLIcon(v-if='option.icon' :icon='option.icon')
</template>

<script lang="ts">
import type { PropType } from "vue";
import { getUID } from "~ui/utils";
import type IInputOption from "~ui/interface/IInputOption";

export default defineComponent({
  name: "SLRadioGroup",
  props: {
    modelValue: {
      type: [Number, String, Boolean],
      default: null,
    },
    options: {
      type: Array as PropType<Array<IInputOption>>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disabledHint: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
      validator: (val: string) =>
        ["", "md", "sm", "xs", "xxs", "3xs"].includes(val),
    },
    color: {
      type: String,
      default: "",
    },
    colorInvert: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { size, color, colorInvert, options, disabled } = toRefs(props);

    const uids = ref<Array<string>>([]);

    const sizeClass = computed(() => {
      const classes = [];
      if (size.value !== "") {
        classes.push(`radio-group--${size.value}`);
      }
      if (color.value !== "") {
        classes.push(`radio-group--${color.value}`);
      }
      if (colorInvert.value) {
        classes.push("color-invert");
      }
      if (disabled.value) {
        classes.push("disabled");
      }

      return classes.join(" ");
    });

    function onChanged(e: Event, targetValue: any) {
      const { target } = e;
      if ((target as HTMLInputElement).checked) {
        emit("update:modelValue", targetValue);
      }
    }

    function onClickedRadio(targetValue: any) {
      if (disabled.value) return;

      emit("update:modelValue", targetValue);
    }

    onMounted(() => {
      uids.value = options.value.map(() => getUID());
    });

    return {
      uids,
      sizeClass,
      onChanged,
      onClickedRadio,
    };
  },
});
</script>

<style lang="stylus">
.radio-group
  @apply inline-flex s('p-0.5') bg-bg border border-line rounded

  &.radio-group--sm
    .radio
      label
        @apply min-w-0 px-2 s('py-1.5')

  &.radio-group--xs
    .radio
      label
        @apply min-w-0 px-4 s('py-0.5') text-sm

  &.radio-group--xxs
    @apply s('p-0.75')

    .radio
      label
        @apply min-w-0 px-2 s('py-0.75') text-sm

  &.radio-group--3xs
    @apply s('p-0.75')

    .radio
      label
        @apply min-w-0 px-2 py-px text-sm

  &.radio-group--third-hover
    @apply bg-third-hover border-third

    .radio
      label
        @apply bg-third-hover text-white

      input:checked + label
        @apply text-third-7

  &.radio-group--edit-purple
    @apply bg-edit-purple border-primary

    &.color-invert
      @apply bg-card-lightpr-bg border-primary-lighter

      .radio
        label
          @apply bg-card-lightpr-bg text-primary-light

        input:checked + label
          @apply bg-edit-purple text-white

    .radio
      label
        @apply bg-edit-purple text-white

      input:checked + label
        @apply text-primary

  &.radio-group--insight-title
    @apply bg-bg border-bg

    &.color-invert
      @apply bg-card-lightpr-bg border-primary-lighter

      .radio
        label
          @apply bg-card-lightpr-bg text-primary-light

        input:checked + label
          @apply bg-edit-purple text-white

    .radio
      label
        @apply bg-bg text-primary

      input:checked + label
        @apply bg-insight-title text-white

  &.disabled
    @apply bg-gray-6 border-gray-6

  .radio
    @apply relative inline-flex

    input
      @apply absolute s('left-1/2') s('top-1/2') transform s('-translate-x-1/2') s('-translate-y-1/2')

    label
      @apply inline-flex justify-center items-center relative s('min-w-[4.5rem]') s('p-1.25') bg-bg rounded text-base leading-normal text-primary-hover cursor-pointer transition

    input:checked + label
      @apply bg-white text-primary shadow

    input:disabled + label
      @apply bg-gray-6 text-gray-4 cursor-default
</style>
