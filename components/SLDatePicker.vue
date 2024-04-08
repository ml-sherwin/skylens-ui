<template lang="pug">
.custom-date-picker
  DatePicker(
    v-model="modelValueProxy"
    :model-modifiers="{ range: isRange }"
    mode='date'
    :color="color"
    :min-date="minDateByDays"
    :max-date="maxDateByDays"
    :update-on-input="false"
    :popover="false"
    :borderless='true'
    @drag="onDrag"
    ref="datePickerComp"
  )
    template(v-if="$slots.default"  v-slot="{inputValue, inputEvents}")
      slot(v-bind="{ inputValue, inputEvents }")
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, ref, computed, watch, toRefs } from "#imports";
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import {
  addDays,
  subDays,
  min as dateMin,
  max as dateMax,
  isDate,
} from "date-fns";
import type IDateRange from "~ui/interface/IDateRange";

type DatePickerType = InstanceType<typeof DatePicker>;

export default defineComponent({
  name: "SLDatePicker",
  components: {
    DatePicker,
  },
  props: {
    modelValue: {
      type: [Date, Object] as PropType<Date | IDateRange | null>,
      default: null,
    },
    color: {
      type: String,
      default: "purple",
    },
    isRange: {
      type: Boolean,
      default: false,
    },
    minDate: {
      type: Date,
      default: () => null,
    },
    maxDate: {
      type: Date,
      default: () => null,
    },
    maxDays: {
      type: Number,
      default: -1,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { minDate, maxDate, maxDays, modelValue } = toRefs(props);

    const datePickerComp = ref<DatePickerType | null>(null);
    const draggingStartDate = ref<Date | null>(null);

    const modelValueProxy = computed({
      get: () => modelValue.value,
      set: (newValue) => {
        draggingStartDate.value = null;
        emit("update:modelValue", newValue);
      },
    });
    const minDateByDays = computed(() => {
      if (!draggingStartDate.value || maxDays.value <= 0) return minDate.value;

      const draggingMinDate = subDays(
        draggingStartDate.value as Date,
        maxDays.value - 1
      );

      return minDate.value
        ? dateMax([minDate.value, draggingMinDate])
        : draggingMinDate;
    });
    const maxDateByDays = computed(() => {
      if (!draggingStartDate.value || maxDays.value <= 0) return maxDate.value;

      const draggingMaxDate = addDays(
        draggingStartDate.value as Date,
        maxDays.value - 1
      );

      return maxDate.value
        ? dateMin([maxDate.value, draggingMaxDate])
        : draggingMaxDate;
    });

    function onDrag(e: IDateRange) {
      if (draggingStartDate.value) return;

      draggingStartDate.value = e.start;
    }

    async function moveToStartDate() {
      const moveTo: Date | null = isDate(modelValue.value)
        ? (modelValue.value as Date)
        : (modelValue.value as IDateRange)?.start;

      if (datePickerComp.value && datePickerComp.value.calendarRef && moveTo) {
        await datePickerComp.value.calendarRef.move(moveTo);
      }
    }

    watch(modelValue, () => {
      if (modelValue.value) {
        moveToStartDate();
      }
    });

    return {
      datePickerComp,
      modelValueProxy,
      minDateByDays,
      maxDateByDays,
      onDrag,
    };
  },
});
</script>

<style lang="stylus">
.custom-date-picker
  .vc-pane-container
    @apply border-0
</style>
