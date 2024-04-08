<template lang="pug">
.hour-range-input(
    :class="{ inline, disabled, readonly: beReadonly }"
  )
  label(v-if="label")
    span {{ label }}
    SLElementWithTitle(title='起始時間請輸入0-23，結束時間請輸入1-24')
      SLIcon(icon='info-circle')
  .form-control(
      ref="toggle"
    )
    .input-group(:class='{ invalid: isStartHourInvalid }')
      input(
        type='text'
        :value='startHour'
        placeholder='0'
        :disabled='disabled'
        @input='onInputedStart'
      )
      span.minutes-label : 00
    .input-group-splitter
    .input-group(:class='{ invalid: isEndHourInvalid }')
      input(
        type='text'
        :value='endHour'
        placeholder='24'
        :disabled='disabled'
        @input='onInputedEnd'
      )
      span.minutes-label : 00
  .invalid-feedback(v-if='isStartHourInvalid || isEndHourInvalid') 起始時間請輸入0-23，結束時間請輸入1-24
</template>

<script lang="ts">
import type { PropType } from "vue";
import type IHourRange from "~ui/interface/IHourRange";

export default defineComponent({
  name: "SLHourRangeInput",
  components: {},
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
      type: Object as PropType<IHourRange | null>,
      default: null,
    },
    step: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    beReadonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const toggle = ref(null);
    const startHour = ref(
      modelValue.value && modelValue.value.start !== null
        ? modelValue.value.start
        : ""
    );
    const endHour = ref(
      modelValue.value && modelValue.value.end !== null
        ? modelValue.value.end
        : ""
    );
    const isStartHourInvalid = ref(false);
    const isEndHourInvalid = ref(false);

    function onInputedStart(e: Event) {
      startHour.value = (e.target as HTMLInputElement).value;
      isStartHourInvalid.value = false;

      let start =
        (e.target as HTMLInputElement).value === ""
          ? null
          : Number((e.target as HTMLInputElement).value);

      if (start !== null && (Number.isNaN(start) || start < 0 || start > 24)) {
        start = null;
      }

      if (start !== null && start === 24) {
        isStartHourInvalid.value = true;
        return;
      }

      emit("update:modelValue", {
        start,
        end: endHour.value === "" ? null : endHour.value,
      });
    }

    function onInputedEnd(e: Event) {
      endHour.value = (e.target as HTMLInputElement).value;
      isEndHourInvalid.value = false;

      let end =
        (e.target as HTMLInputElement).value === ""
          ? null
          : Number((e.target as HTMLInputElement).value);

      if (end !== null && (Number.isNaN(end) || end < 0 || end > 24)) {
        end = null;
      }

      if (end !== null && end === 0) {
        isEndHourInvalid.value = true;
        return;
      }

      emit("update:modelValue", {
        start: startHour.value === "" ? null : startHour.value,
        end,
      });
    }

    watch(modelValue, () => {
      startHour.value = "";
      endHour.value = "";

      if (
        modelValue.value &&
        modelValue.value.start !== null &&
        modelValue.value?.start !== undefined &&
        !Number.isNaN(modelValue.value.start)
      ) {
        startHour.value = modelValue.value.start;
      }

      if (
        modelValue.value &&
        modelValue.value.end !== null &&
        modelValue.value?.end !== undefined &&
        !Number.isNaN(modelValue.value.end)
      ) {
        endHour.value = modelValue.value.end;
      }
    });

    return {
      toggle,
      startHour,
      endHour,
      isStartHourInvalid,
      isEndHourInvalid,
      onInputedStart,
      onInputedEnd,
    };
  },
});
</script>

<style lang="stylus">
.hour-range-input
  &.inline
    @apply flex

    & > label
      @apply flex-grow-0 flex-shrink-0 mb-0 mr-2 py-2 border-t border-b border-transparent

    .form-control
      @apply flex-grow

  &.disabled, &.readonly
    .input-group
      @apply border-primary-light bg-bg


  & > label
    @apply flex items-center mb-2 space-x-2 text-base leading-normal text-gray-2

    .icon
      @apply text-xs leading-none

  .form-control
    @apply flex items-center space-x-2

  .input-group
    @apply flex items-center flex-nowrap p-2 bg-white border border-primary-light rounded text-base space-x-1

    &.invalid
      @apply border-danger

    input[type=text]
      @apply flex-grow-0 flex-shrink-0 s('w-4.75') border-0 bg-transparent text-base text-center text-gray-2 outline-none

    .minutes-label
      @apply flex-grow-0 flex-shrink-0

  .input-group-splitter
    @apply w-4 h-px bg-primary

  .invalid-feedback
    @apply mt-1 text-danger text-xs
</style>
