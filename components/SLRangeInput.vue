<template lang="pug">
.range-input(
    :class="{ inline, disabled, readonly: beReadonly }"
  )
  label(v-if="label") {{ label }}
  .form-control(
      :class="{ 'is-invalid': isInvalid !== null && isInvalid, 'is-valid': isInvalid !== null && !isInvalid }"
      ref="toggle"
    )
    .input-group(
        :class="{ 'is-fill': !!modelValue }"
      )
      .input-range-group
        .range-input-accept-values
          span {{ min }}
          span {{ max }}
        VueSlider(
          v-model='modelValueProxy'
          :min='min'
          :max='max'
          :interval='step'
          :contained='true'
          :lazy='false',
          :disabled='disabled || beReadonly || min === max'
          :dotSize='12'
          :height='6'
          tooltip='none'
          :dotOptions='dotOptions'
          :railStyle='railStyle'
          :processStyle='processStyle'
        )
      input(
        type='text'
        :value='modelValue'
        :disabled='disabled || min === max'
        @input='onInputed'
        @blur='onBlured'
      )
    .invalid-feedback
      slot(name="invalid-feedback") {{ invalidFeedback }}
</template>

<script lang="ts">
import "vue-slider-component/theme/default.css";
import VueSlider from "vue-slider-component";
import type { DotOption } from "vue-slider-component";

export default defineComponent({
  name: "SLRangeInput",
  components: { VueSlider },
  props: {
    label: {
      type: String,
      default: undefined,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 10,
    },
    step: {
      type: Number,
      default: 1,
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
    beReadonly: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue, disabled, beReadonly, min, max } = toRefs(props);

    const toggle = ref(null);

    const modelValueProxy = computed({
      get: () => modelValue.value,
      set: (newValue) => {
        emit("update:modelValue", newValue);
      },
    });
    const railStyle = computed(() => ({
      backgroundColor: "#E8EAF2",
    }));
    const dotOptions = computed<DotOption>(() => ({
      disabled: disabled.value || beReadonly.value,
      tooltip: "none",
      style: {
        backgroundColor: "#8486B4",
        borderColor: "#8486B4",
      },
      focusStyle: {
        boxShadow: "none",
      },
      disabledStyle: {
        backgroundColor: "#A09BAF",
        borderColor: "#A09BAF",
      },
    }));
    const processStyle = computed(() => ({
      backgroundColor: "#8486B4",
    }));
    const tooltipStyle = computed(() => ({
      display: "none",
    }));

    function onInputed(e: Event) {
      const newValue = Number((e.target as HTMLInputElement).value);

      if (Number.isNaN(newValue) || newValue < min.value) {
        emit("update:modelValue", min.value);
        return;
      } else if (newValue > max.value) {
        emit("update:modelValue", max.value);
        return;
      }

      emit("update:modelValue", newValue);
    }

    function onBlured(e: Event) {
      (e.target as HTMLInputElement).value = `${modelValue.value}`;
    }

    return {
      toggle,
      modelValueProxy,
      railStyle,
      dotOptions,
      processStyle,
      tooltipStyle,
      onInputed,
      onBlured,
    };
  },
});
</script>

<style lang="stylus">
.range-input
  &.inline
    @apply flex

    & > label
      @apply flex-grow-0 flex-shrink-0 mb-0 mr-2 py-2 border-t border-b border-transparent

    .form-control
      @apply flex-grow

  &.disabled, &.readonly
    .input-group
      .input-range-group
        .range-input-accept-values
          @apply text-gray-4

      input[type=text]
        @apply border-primary-light bg-bg

  & > label
    @apply mb-2 text-base leading-normal text-gray-2

  .is-invalid
    .invalid-feedback
      @apply block


  .input-group
    @apply flex flex-nowrap text-base leading-normal space-x-4

    .input-range-group
      @apply flex-grow

      .range-input-accept-values
        @apply flex justify-between mb-1 text-sm text-gray-3

    input[type=text]
      @apply flex-grow-0 flex-shrink-0 w-11 bg-white border border-primary-light rounded text-base text-center text-gray-2
      @apply s('focus:outline-none')

  .invalid-feedback
    @apply hidden text-danger text-xs
</style>
