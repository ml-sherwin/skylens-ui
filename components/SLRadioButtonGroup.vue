<template lang="pug">
.radio-button-group(:class='{ "radio-button-group--lg": size === "lg" }')
  label(v-if="label !== ''") {{ label }}
  .form-control(
      :class="{ 'is-invalid': isInvalid !== null && isInvalid, 'is-valid': isInvalid !== null && !isInvalid, inline: radioInline }"
    )
    SLRadioButton(
        v-for="option, i in options"
        v-model="modelProxy"
        :label="option.label"
        :value="option.value"
        :key="i"
        :disabled='disabled || option.disabled'
      )
    .invalid-feedback
      slot(name="invalid-feedback") {{ invalidFeedback }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import type IInputOption from "~ui/interface/IInputOption";

export default defineComponent({
  name: "SLRadioButtonGroup",
  components: {},
  props: {
    modelValue: {
      type: [Number, String, Boolean, Object],
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    options: {
      type: Array as PropType<Array<IInputOption>>,
      default: () => [],
    },
    inline: {
      type: Boolean,
      default: false,
    },
    radioInline: {
      type: Boolean,
      default: true,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    invalidFeedback: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<"" | "lg">,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const modelProxy = ref(modelValue.value);

    watch(modelValue, () => {
      modelProxy.value = modelValue.value;
    });
    watch(modelProxy, () => {
      emit("update:modelValue", modelProxy.value);
    });

    return {
      modelProxy,
    };
  },
});
</script>

<style lang="stylus">
.radio-button-group
  .is-invalid
    .invalid-feedback
      @apply block

  & > label
    @apply mb-2 text-base text-gray-2 align-top

  .form-control
    @apply flex flex-col space-y-1

    &.inline
      @apply flex flex-row flex-wrap space-x-6 space-y-0

  .invalid-feedback
    @apply hidden text-danger text-xs

  &--lg
    .form-control
      &.inline
        @apply space-x-8

      .radio-button
        label
          @apply text-sm

          span
            @apply ml-2 text-sm
</style>
