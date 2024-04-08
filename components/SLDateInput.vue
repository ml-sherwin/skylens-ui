<template lang="pug">
.date-input(
    :class="dateInputClass"
  )
  label(v-if="label") {{ label }}
  .form-control(
      :class="{ 'is-invalid': isInvalid !== null && isInvalid, 'is-valid': isInvalid !== null && !isInvalid }"
      ref="toggle"
    )
    .input-group(
        :class="{ 'is-fill': !!modelValue }"
      )
      .input-group-prepend
        SLIcon(icon="calendar")
      .inputs
        DatePicker(
          :modelValue="startDate"
          :mode='mode'
          :is24hr='is24hr'
          :min-date='minDate'
          :max-date='maxDate'
          :masks='dateMasks'
          :attributes='attributes'
          :popover='popover',
          color='skylens-purple'
          @update:modelValue="onUpdatedStartDate"
          ref='startDatePickerComp'
        )
          template(#default="{ inputValue, inputEvents }")
            input(
                type="text"
                :value="inputValue"
                :placeholder="startDatePlaceholder"
                :disabled="disabled"
                v-on="inputEvents"
                @focus="onFocusStartDate"
              )
        template(v-if='isRange')
          .date-range-split -
          DatePicker(
            :modelValue="endDate"
            :mode='mode'
            :is24hr='is24hr'
            :min-date='endMinDate'
            :max-date='maxDate'
            :masks='dateMasks'
            :attributes='attributes'
            :popover='popover'
            color='skylens-purple'
            @update:modelValue="onUpdatedEndDate"
            ref='endDatePickerComp'
          )
            template(#default="{ inputValue, inputEvents }")
              input(
                  type="text"
                  :value="inputValue"
                  :placeholder="endDatePlaceholder"
                  :disabled="disabled"
                  v-on="inputEvents"
                  @focus="onFocusEndDate"
                )
        SLIcon(icon="exclamation-triangle")
    .input-info(v-if='info !== ""') {{ info }}
    .invalid-feedback
      slot(name="invalid-feedback") {{ invalidFeedback }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import type { PopoverVisibility } from "v-calendar/dist/types/src/utils/popovers";
import { isDate, differenceInCalendarDays } from "date-fns";
import type IDateRange from "~ui/interface/IDateRange";

type DatePickerType = InstanceType<typeof DatePicker> & {
  hidePopover: () => void;
};

export default defineComponent({
  name: "DateInput",
  components: { DatePicker },
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
      type: [Date, Object] as PropType<Date | IDateRange | null>,
      default: null,
    },
    minDate: {
      type: Date,
      default: null,
    },
    maxDate: {
      type: Date,
      default: null,
    },
    startPlaceholder: {
      type: String,
      default: "",
    },
    endPlaceholder: {
      type: String,
      default: "",
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    invalidFeedback: {
      type: String,
      default: "",
    },
    lazy: {
      type: [Boolean, Number],
      default: true,
    },
    isRange: {
      type: Boolean,
      default: true,
    },
    maxRangeDays: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "date",
      validator: (val: string) => ["date", "dateTime", "time"].includes(val),
    },
    is24hr: {
      type: Boolean,
      default: true,
    },
    beReadonly: {
      type: Boolean,
      default: false,
    },
    info: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
      validator: (val: string) => ["", "xs"].includes(val),
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const {
      inline,
      modelValue,
      isRange,
      maxRangeDays,
      is24hr,
      minDate,
      maxDate,
      disabled,
      mode,
      startPlaceholder,
      endPlaceholder,
      beReadonly,
      size,
    } = toRefs(props);

    const startDatePickerComp = shallowRef<DatePickerType | null>(null);
    const endDatePickerComp = shallowRef<DatePickerType | null>(null);
    const toggle = ref(null);
    const startDate = ref<Date | null>(
      isDate(modelValue.value)
        ? (modelValue.value as Date)
        : (modelValue.value as IDateRange)?.start || null
    );
    const endDate = ref<Date | null>(
      isDate(modelValue.value)
        ? null
        : (modelValue.value as IDateRange)?.end || null
    );

    const dateInputClass = computed(() => {
      const dateInputClass = [
        {
          inline: inline.value,
          disabled: disabled.value,
          readonly: beReadonly.value,
        },
        `date-input-${mode.value}`,
      ];

      if (isRange.value) {
        dateInputClass.push("date-input-range");
      }

      if (size.value) {
        dateInputClass.push(`date-input-${size.value}`);
      }

      return dateInputClass;
    });
    const dateMasks = computed(() => {
      return {
        input: "YYYY/MM/DD",
        inputDateTime: "YYYY/MM/DD h:mm A",
        inputDateTime24hr: "YYYY/MM/DD HH:mm",
        inputTime: "h:mm A",
        inputTime24hr: "HH:mm",
      };
    });
    const attributes = computed(() => {
      return [
        {
          bar: {
            style: {
              backgroundColor: "#BABBE1",
            },
          },
          dates: [new Date()],
        },
      ];
    });
    const popover = computed(() => {
      return beReadonly.value
        ? false
        : {
            visibility: "click" as PopoverVisibility,
          };
    });
    const endMinDate = computed(() => {
      if (!isRange.value || !startDate.value) {
        return minDate.value;
      }

      return startDate.value;
    });
    const startDatePlaceholder = computed(() => {
      let startDatePlaceholder = "";

      switch (mode.value) {
        case "date":
          startDatePlaceholder = "YYYY/MM/DD";
          break;
        case "dateTime":
          startDatePlaceholder = `YYYY/MM/DD ${is24hr.value ? "HH" : "hh"}:mm`;
          break;
        default:
          startDatePlaceholder = `${is24hr.value ? "HH" : "hh"}:mm`;
          break;
      }

      return startPlaceholder.value || startDatePlaceholder;
    });
    const endDatePlaceholder = computed(() => {
      let endDatePlaceholder = "";

      switch (mode.value) {
        case "date":
          endDatePlaceholder = "YYYY/MM/DD";
          break;
        case "dateTime":
          endDatePlaceholder = `YYYY/MM/DD ${is24hr.value ? "HH" : "hh"}:mm`;
          break;
        default:
          endDatePlaceholder = `${is24hr.value ? "HH" : "hh"}:mm`;
          break;
      }

      return endPlaceholder.value || endDatePlaceholder;
    });

    function onUpdatedStartDate(newValue: Date | null) {
      if (!isRange.value) {
        emit("update:modelValue", newValue);
        return;
      }

      if (
        endDate.value &&
        newValue &&
        (newValue > endDate.value ||
          (maxRangeDays.value > 0 &&
            Math.abs(differenceInCalendarDays(newValue, endDate.value)) >
              maxRangeDays.value))
      ) {
        endDate.value = null;
      }

      emit("update:modelValue", {
        start: newValue,
        end: endDate.value,
      });
    }

    function onUpdatedEndDate(newValue: Date | null) {
      if (!isRange.value) return;

      if (
        startDate.value &&
        newValue &&
        (newValue < startDate.value ||
          (maxRangeDays.value > 0 &&
            Math.abs(differenceInCalendarDays(newValue, startDate.value)) >
              maxRangeDays.value))
      ) {
        startDate.value = null;
      }

      emit("update:modelValue", {
        start: startDate.value,
        end: newValue,
      });
    }

    function onFocusStartDate() {
      if (endDatePickerComp.value) {
        endDatePickerComp.value.hidePopover();
      }
    }

    function onFocusEndDate() {
      if (startDatePickerComp.value) {
        startDatePickerComp.value.hidePopover();
      }
    }

    watch(modelValue, () => {
      startDate.value = isDate(modelValue.value)
        ? (modelValue.value as Date)
        : (modelValue.value as IDateRange)?.start || null;
      endDate.value = isDate(modelValue.value)
        ? null
        : (modelValue.value as IDateRange)?.end || null;
    });

    return {
      startDatePickerComp,
      endDatePickerComp,
      toggle,
      startDate,
      endDate,
      dateInputClass,
      dateMasks,
      attributes,
      popover,
      endMinDate,
      startDatePlaceholder,
      endDatePlaceholder,
      onUpdatedStartDate,
      onUpdatedEndDate,
      onFocusStartDate,
      onFocusEndDate,
    };
  },
});
</script>

<style lang="stylus">
.date-input
  &.date-input-xs
    .input-group
      &-prepend
        @apply s('pl-2.75') pr-4 rounded-l-lg

      .inputs
        @apply pl-0 rounded-r-lg

    .input-group
      .inputs
        div
          input
            @apply s('w-[5.875rem]') text-center

  &.date-input-range.date-input-dateTime
    .input-group
      .inputs
        div
          input
            @apply s('w-[10.5rem]')

  &.inline
    @apply flex

    & > label
      @apply flex-grow-0 flex-shrink-0 mb-0 mr-2 py-2 border-t border-b border-transparent

    .form-control
      @apply flex-grow

  &.disabled, &.readonly
    .input-group
      .input-group-prepend, .inputs
        @apply border-primary-light bg-bg


  & > label
    @apply mb-2 text-base leading-normal text-gray-2

  .is-invalid
    .input-group, .input-group.is-focus
      .input-group-prepend
        @apply border-danger-hover

      .inputs
        @apply border-danger-hover

        .icon
          @apply inline-block

    .invalid-feedback
      @apply block


  .input-group
    @apply flex flex-nowrap text-base leading-normal

    &.is-focus
      .input
        @apply border-primary

    &.is-fill, &.is-focus
      .input
        .float-label
          @apply s('ml-1.5') s('-mt-2.25') py-0 s('px-0.5') bg-white text-primary text-xs transition-input-focus

    &-prepend
      @apply flex-grow-0 flex-shrink-0 flex items-center relative pl-4 pr-6 rounded-l border border-r-0 border-primary-light bg-white text-base leading-none

      &:after
        content ''
        @apply block absolute top-2 s('right-1.75') bottom-2 w-px bg-primary

    .inputs
      @apply relative flex-grow flex items-center p-2 bg-white rounded-r border border-l-0 border-primary-light text-base text-gray-2

      div
        input
          @apply w-full bg-transparent text-base text-gray-2 text-left placeholder-gray-4 s('focus:outline-none')

      .date-range-split
        @apply s('mx-0.5')

      .icon
        @apply absolute right-0 mr-2 text-danger-hover hidden

  .input-info
    @apply mt-1 text-xs text-gray-3

  .invalid-feedback
    @apply hidden text-danger text-xs
</style>
