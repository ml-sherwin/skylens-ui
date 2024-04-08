<template lang="pug">
.calendar-popup(ref='el')
  .popup-body
    .quicks(v-if="showQuicks")
      a(
        href="javascript:;"
        :class="{ selected: status1 === 'custom' }"
        @click="onClickedQuick('custom')"
      ).quick-button
        .quick-button-title 自訂
        .quick-button-notice ({{ minDateNotice }})
      .quicks-divide
      a(
        v-for="quick in quicks"
        href="javascript:;"
        :class="{ selected: status1 === quick.key }"
        :key="quick.key"
        @click="onClickedQuick(quick.key)"
      ).quick-button
        .quick-button-title {{ quick.label }}
      SLIOSSwitch(v-if="showCompareSwitch" v-model="isCompare" trueLabel="比較" falseLabel="比較").compare-switch
    .calendar.calendar-compare(v-show="isCompare && showCompareSwitch")
      .calendar-header
        .date-range-status(:class='{ "text-danger": rangeInput2.start.invalid || rangeInput2.end.invalid }') 比較 {{ range2Status }}
        .date-range
          SLTextInput(
            size='sm',
            :lazy='1000',
            :modelValue='rangeInput2.start.value'
            :isInvalid="rangeInput2.start.invalid"
            @update:modelValue='(value) => onRangeInputUpdated(2, "start", value)'
          )
          span -
          SLTextInput(
            size='sm',
            :lazy='1000',
            :modelValue='rangeInput2.end.value'
            :isInvalid="rangeInput2.end.invalid"
            @update:modelValue='(value) => onRangeInputUpdated(2, "end", value)'
          )
          SLElementWithTitle(
            v-if='rangeInput2.start.invalid || rangeInput2.end.invalid'
            title='日期格式有誤或選取超過365天'
          )
            SLIcon.text-xs.text-danger(icon='exclamation-circle')
      .calendar-body
        SLDatePicker(
            v-model="dateRange2"
            color="skylens-gray"
            :is-range="true"
            :min-date="minDateProxy"
            :max-date="maxDate2"
            :max-days="maxDaysProxy"
          )
    .calendar
      .calendar-header
        .date-range-status(:class='{ "text-danger": rangeInput1.start.invalid || rangeInput1.end.invalid }') {{ range1Status }}
        .date-range
          SLTextInput(
            size='sm',
            :lazy='1000',
            :modelValue='rangeInput1.start.value'
            :isInvalid="rangeInput1.start.invalid"
            @update:modelValue='(value) => onRangeInputUpdated(1, "start", value)'
          )
          span -
          SLTextInput(
            size='sm',
            :lazy='1000',
            :modelValue='rangeInput1.end.value'
            :isInvalid="rangeInput1.end.invalid"
            @update:modelValue='(value) => onRangeInputUpdated(1, "end", value)'
          )
          SLElementWithTitle(
            v-if='rangeInput1.start.invalid || rangeInput1.end.invalid'
            title='日期格式有誤或選取超過365天'
          )
            SLIcon.text-xs.text-danger(icon='exclamation-circle')
      .calendar-body
        SLDatePicker(
            v-model="dateRange1"
            color='skylens-purple'
            :is-range="true"
            :min-date="minDateProxy"
            :max-date="maxDate1"
            :max-days="maxDaysProxy"
          )
        .data-date 最新資料：{{ dataDateString }}（{{ dataSourceTypeString }}）
  .popup-footer
    //- .compare(v-if="isCompare") 比較 #[span.range1 {{ dateRange1Style2 }}] 與 #[span.range2 {{ dateRange2Style2 }}]
    .actions
      SLButton(
          size="lg"
          color="cancel"
          title="取消"
          @click="onClickedCancel"
        )
      SLButton(
          size="lg"
          color="primary"
          title="套用"
          :disabled="isApplyButtonDisabled"
          @click="onClickedApply"
        )
</template>

<script lang="ts">
import type { PropType } from "vue";
import {
  parse as parseDateString,
  format as formatDate,
  addDays,
  subDays,
  differenceInCalendarDays,
  isBefore,
  subYears,
  startOfMonth,
} from "date-fns";
import {
  dateRangeToStatus,
  statusToDateRange,
  isPreviousDateRange,
  previousDateRange,
  isValidDate,
} from "~ui/utils";
import { DEFAULT_END_DATE_BEFORE_NOW } from "~ui/utils/constants";
import type IDateRange from "~ui/interface/IDateRange";
import { OnlineSourceType } from "~ui/interface/IWeb";

const DateStringRegexp = /[0-9]{4}\/[0-9]{2}\/[0-9]{2}/;

export default defineComponent({
  name: "SLCalendarPopup",
  components: {},
  props: {
    dataSourceType: {
      type: Number as PropType<OnlineSourceType>,
      default: OnlineSourceType.Mobile,
    },
    showQuicks: {
      type: Boolean,
      default: true,
    },
    showCompareSwitch: {
      type: Boolean,
      default: true,
    },
    minDate: {
      type: Date,
      default: () => null,
    },
    maxDate: {
      type: Date,
      default: () => subDays(Date.now(), 1),
    },
    maxDays: {
      type: Number,
      default: -1,
    },
    modelValue: {
      type: Array as PropType<Array<IDateRange | null>>,
      default: () => [
        { start: new Date(2021, 1, 11), end: new Date(2021, 1, 17) },
      ],
    },
  },
  emits: ["update:modelValue", "compare:change"],
  setup(props, { emit }) {
    const { dataSourceType, minDate, maxDate, maxDays, modelValue } =
      toRefs(props);

    const el = shallowRef<HTMLElement | null>(null);
    const dateRange1 = ref<IDateRange | null>(modelValue.value[0]);
    const dateRange2 = ref<IDateRange | null>(modelValue.value[1]);
    const isCompare = ref(!!modelValue.value[1]);
    const rangeInput1 = reactive({
      start: {
        value: formatDate(
          modelValue.value && modelValue.value[0]
            ? modelValue.value[0].start
            : new Date(),
          "yyyy/MM/dd"
        ),
        invalid: false,
      },
      end: {
        value: formatDate(
          modelValue.value && modelValue.value[0]
            ? modelValue.value[0].end
            : new Date(),
          "yyyy/MM/dd"
        ),
        invalid: false,
      },
    });
    const rangeInput2 = reactive({
      start: {
        value: modelValue.value[1]
          ? formatDate(modelValue.value[1].start, "yyyy/MM/dd")
          : "",
        invalid: false,
      },
      end: {
        value: modelValue.value[1]
          ? formatDate(modelValue.value[1].end, "yyyy/MM/dd")
          : "",
        invalid: false,
      },
    });

    const minDateProxy = computed(() => {
      if (!minDate.value) {
        return subYears(startOfMonth(new Date()), 3);
      }

      return minDate.value;
    });
    const dataSourceTypeString = computed(() => {
      switch (dataSourceType.value) {
        case OnlineSourceType.Mobile:
          return "行動";
        default:
          return "固網";
      }
    });
    const rangeInputDate1 = computed(() => {
      const inputStartDate = parseDateString(
        rangeInput1.start.value,
        "yyyy/MM/dd",
        new Date()
      );
      const inputEndDate = parseDateString(
        rangeInput1.end.value,
        "yyyy/MM/dd",
        new Date()
      );
      const invalidInputStartDate = !DateStringRegexp.test(
        rangeInput1.start.value
      );
      const invalidInputEndDate = !DateStringRegexp.test(rangeInput1.end.value);

      if (
        !isValidDate(inputStartDate) ||
        !isValidDate(inputEndDate) ||
        invalidInputStartDate ||
        invalidInputEndDate ||
        differenceInCalendarDays(inputEndDate, inputStartDate) < 0
      ) {
        return null;
      }

      return {
        start: inputStartDate,
        end: inputEndDate,
      };
    });
    const rangeInputDate2 = computed(() => {
      const inputStartDate = parseDateString(
        rangeInput2.start.value,
        "yyyy/MM/dd",
        new Date()
      );
      const inputEndDate = parseDateString(
        rangeInput2.end.value,
        "yyyy/MM/dd",
        new Date()
      );
      const invalidInputStartDate = !DateStringRegexp.test(
        rangeInput2.start.value
      );
      const invalidInputEndDate = !DateStringRegexp.test(rangeInput2.end.value);

      if (
        !isValidDate(inputStartDate) ||
        !isValidDate(inputEndDate) ||
        invalidInputStartDate ||
        invalidInputEndDate ||
        differenceInCalendarDays(inputEndDate, inputStartDate) < 0
      ) {
        return null;
      }

      return {
        start: inputStartDate,
        end: inputEndDate,
      };
    });
    const dataDateString = computed(() => {
      switch (dataSourceType.value) {
        case OnlineSourceType.Mobile:
          return formatDate(
            subDays(new Date(), DEFAULT_END_DATE_BEFORE_NOW),
            "yyyy/MM/dd"
          );
        default:
          return formatDate(
            subDays(new Date(), DEFAULT_END_DATE_BEFORE_NOW + 2),
            "yyyy/MM/dd"
          );
      }
    });
    const maxDaysProxy = computed(() => {
      if (minDateProxy.value) {
        const diff =
          differenceInCalendarDays(maxDate.value, minDateProxy.value) + 1;
        return maxDays.value === -1 ? diff : Math.min(diff, maxDays.value);
      }

      return maxDays.value;
    });
    const diffNow = computed(() => {
      const now = new Date();
      const diffNow = maxDate.value
        ? differenceInCalendarDays(now, maxDate.value)
        : 0;
      return diffNow;
    });
    const baseDate = computed(() => {
      if (diffNow.value <= 0) {
        return new Date();
      }

      return addDays(maxDate.value, 1);
    });
    const baseDateString = computed(() => {
      return formatDate(baseDate.value, "yyyy/MM/dd");
    });
    const quicks = computed(() => {
      const quicks = [
        { key: "last7Days", label: "過去7天" },
        { key: "last30Days", label: "過去30天" },
      ];

      if (maxDaysProxy.value >= 90) {
        quicks.push({ key: "last90Days", label: "過去90天" });
      }

      // if (diffNow.value <= 0) {
      //   quicks.push({ key: 'yesterday', label: '昨天' });
      // } else {
      //   quicks.push({ key: 'yesterday', label: '過去1天' });
      // }

      return [...quicks, { key: "lastMonth", label: "上個月" }];
    });
    const maxDate1 = computed(() => {
      return maxDate.value;
    });
    const status1 = computed(() => {
      if (isCompare.value) {
        return status2.value === "custom"
          ? "custom"
          : dateRangeToStatus(dateRange1.value, baseDate.value);
      } else {
        return dateRangeToStatus(dateRange1.value, baseDate.value);
      }
    });
    const range1Status = computed(() => {
      if (status1.value === "custom") {
        const days =
          !rangeInputDate1.value ||
          !rangeInputDate1.value.start ||
          !rangeInputDate1.value.end
            ? -1
            : differenceInCalendarDays(
                rangeInputDate1.value.end,
                rangeInputDate1.value.start
              ) + 1;
        return `自訂 ${days === -1 ? "" : `${days}天`}`;
      }

      const quick = quicks.value.find((q) => q.key === status1.value);
      if (!quick) {
        return "";
      }
      return quick.label;
    });
    const dateRange1Style1 = computed(() => {
      if (!dateRange1.value) return "";

      return `${
        dateRange1.value.start
          ? formatDate(dateRange1.value.start, "yyyy/MM/dd")
          : ""
      }${
        dateRange1.value.end
          ? `-${formatDate(dateRange1.value.end, "yyyy/MM/dd")}`
          : ""
      }`;
    });
    const dateRange1Style2 = computed(() => {
      if (!dateRange1.value) return "";

      return `${
        dateRange1.value ? formatDate(dateRange1.value.start, "yyyy/MM/dd") : ""
      }${
        dateRange1.value.end
          ? ` - ${formatDate(dateRange1.value.end, "yyyy/MM/dd")}`
          : ""
      }`;
    });
    const maxDate2 = computed(() => {
      if (!dateRange1.value) return maxDate1.value;
      const { start } = dateRange1.value as IDateRange;
      return subDays(start, 1);
    });
    const status2 = computed(() => {
      return isPreviousDateRange(dateRange1.value, rangeInputDate2.value);
    });
    const range2Status = computed(() => {
      if (status2.value === "previous") {
        return "上一個時段";
      }

      const days =
        !rangeInputDate2.value ||
        !rangeInputDate2.value.start ||
        !rangeInputDate2.value.end
          ? -1
          : differenceInCalendarDays(
              rangeInputDate2.value.end,
              rangeInputDate2.value.start
            ) + 1;
      return `自訂 ${days === -1 ? "" : `${days}天`}`;
    });
    const dateRange2Style1 = computed(() => {
      if (!dateRange2.value) return "";

      return `${
        dateRange2.value.start
          ? formatDate(dateRange2.value.start, "yyyy/MM/dd")
          : ""
      }${
        dateRange2.value.end
          ? `-${formatDate(dateRange2.value.end, "yyyy/MM/dd")}`
          : ""
      }`;
    });
    const dateRange2Style2 = computed(() => {
      if (!dateRange2.value) return "";
      return `${
        dateRange2.value.start
          ? formatDate(dateRange2.value.start, "yyyy/MM/dd")
          : ""
      }${
        dateRange2.value.end
          ? ` - ${formatDate(dateRange2.value.end, "yyyy/MM/dd")}`
          : ""
      }`;
    });
    const isApplyButtonDisabled = computed(() => {
      return (
        !dateRange1.value ||
        !dateRange1.value.start ||
        !dateRange1.value.end ||
        rangeInput1.start.invalid ||
        rangeInput1.end.invalid ||
        (isCompare.value &&
          (!dateRange2.value ||
            !dateRange2.value.start ||
            !dateRange2.value.end ||
            rangeInput2.start.invalid ||
            rangeInput2.end.invalid))
      );
    });
    const minDateNotice = computed(() => {
      const threeYearsAgo = subYears(startOfMonth(new Date()), 3);

      if (
        minDateProxy.value.getFullYear() === threeYearsAgo.getFullYear() &&
        minDateProxy.value.getMonth() === threeYearsAgo.getMonth() &&
        minDateProxy.value.getDate() === threeYearsAgo.getDate()
      ) {
        return "過去3年資料";
      }

      return `${formatDate(minDateProxy.value, "yyyy/MM/dd")}起`;
    });

    function onClickedQuick(key: string) {
      const dateRange = statusToDateRange(key, baseDate.value);

      // if (dateRange) {
      dateRange1.value = dateRange;
      // }
    }

    function onClickedCancel() {
      emit("update:modelValue", modelValue.value);
      reset();
    }

    function onClickedApply() {
      if (isApplyButtonDisabled.value) {
        return;
      }

      const applyValue = [dateRange1.value];

      if (isCompare.value && dateRange2.value) {
        applyValue.push(dateRange2.value);
      }

      emit("update:modelValue", applyValue);
    }

    function onRangeInputUpdated(
      rangeIndex: 1 | 2,
      rangeDateKey: "start" | "end",
      inputValue: string
    ) {
      const pMaxDays = maxDaysProxy.value > -1 ? maxDaysProxy.value : 365;

      if (rangeIndex === 1) {
        rangeInput1[rangeDateKey].value = inputValue;
      }

      rangeInput1.start.invalid = false;
      rangeInput1.end.invalid = false;

      const input1StartDate = parseDateString(
        rangeInput1.start.value,
        "yyyy/MM/dd",
        new Date()
      );
      const input1EndDate = parseDateString(
        rangeInput1.end.value,
        "yyyy/MM/dd",
        new Date()
      );
      const invalidInput1StartDate = !DateStringRegexp.test(
        rangeInput1.start.value
      );
      const invalidInput1EndDate = !DateStringRegexp.test(
        rangeInput1.end.value
      );

      if (
        invalidInput1StartDate ||
        isBefore(input1StartDate, minDateProxy.value) ||
        isBefore(maxDate.value, input1StartDate) ||
        (!invalidInput1EndDate && isBefore(input1EndDate, input1StartDate))
      ) {
        rangeInput1.start.invalid = true;
      }

      if (
        invalidInput1EndDate ||
        isBefore(input1EndDate, minDateProxy.value) ||
        isBefore(maxDate.value, input1EndDate) ||
        (!invalidInput1StartDate && isBefore(input1EndDate, input1StartDate))
      ) {
        rangeInput1.end.invalid = true;
      }

      if (
        !invalidInput1StartDate &&
        !invalidInput1EndDate &&
        differenceInCalendarDays(input1EndDate, input1StartDate) >= pMaxDays
      ) {
        rangeInput1.start.invalid = true;
        rangeInput1.end.invalid = true;
      }

      if (
        !rangeInput1.start.invalid &&
        !rangeInput1.end.invalid &&
        rangeIndex === 1
      ) {
        dateRange1.value = {
          start: input1StartDate,
          end: input1EndDate,
        };
      }

      if (!isCompare.value) return;

      if (rangeIndex === 2) {
        rangeInput2[rangeDateKey].value = inputValue;
      }

      rangeInput2.start.invalid = false;
      rangeInput2.end.invalid = false;

      const input2StartDate = parseDateString(
        rangeInput2.start.value,
        "yyyy/MM/dd",
        new Date()
      );
      const input2EndDate = parseDateString(
        rangeInput2.end.value,
        "yyyy/MM/dd",
        new Date()
      );
      const invalidInput2StartDate = !DateStringRegexp.test(
        rangeInput2.start.value
      );
      const invalidInput2EndDate = !DateStringRegexp.test(
        rangeInput2.end.value
      );

      if (
        !isValidDate(input2StartDate) ||
        invalidInput2StartDate ||
        isBefore(input2StartDate, minDateProxy.value) ||
        isBefore(maxDate.value, input2StartDate) ||
        (!invalidInput2EndDate && isBefore(input2EndDate, input2StartDate)) ||
        (!invalidInput1StartDate && isBefore(input1StartDate, input2StartDate))
      ) {
        rangeInput2.start.invalid = true;
      }

      if (
        !isValidDate(input2EndDate) ||
        invalidInput2EndDate ||
        isBefore(input2EndDate, minDateProxy.value) ||
        isBefore(maxDate.value, input2EndDate) ||
        (!invalidInput2StartDate && isBefore(input2EndDate, input2StartDate)) ||
        (!invalidInput1StartDate && isBefore(input1StartDate, input2EndDate)) ||
        (!invalidInput1EndDate && isBefore(input1EndDate, input2EndDate))
      ) {
        rangeInput2.end.invalid = true;
      }

      if (
        (!isValidDate(input2StartDate) && !isValidDate(input2EndDate)) ||
        (!invalidInput2StartDate &&
          !invalidInput2EndDate &&
          differenceInCalendarDays(input2EndDate, input2StartDate) >= pMaxDays)
      ) {
        rangeInput2.start.invalid = true;
        rangeInput2.end.invalid = true;
      }

      if (
        !rangeInput2.start.invalid &&
        !rangeInput2.end.invalid &&
        rangeIndex === 2
      ) {
        dateRange2.value = {
          start: input2StartDate,
          end: input2EndDate,
        };
      }
    }

    function reset() {
      const [orginalDateRange1, orginalDateRange2] = modelValue.value;

      dateRange1.value = orginalDateRange1;
      dateRange2.value = orginalDateRange2;
      isCompare.value = !!orginalDateRange2;

      rangeInput1.start = {
        value: formatDate(
          modelValue.value && modelValue.value[0]
            ? modelValue.value[0].start
            : new Date(),
          "yyyy/MM/dd"
        ),
        invalid: false,
      };
      rangeInput1.end = {
        value: formatDate(
          modelValue.value && modelValue.value[0]
            ? modelValue.value[0].end
            : new Date(),
          "yyyy/MM/dd"
        ),
        invalid: false,
      };
      rangeInput2.start = {
        value: modelValue.value[1]
          ? formatDate(modelValue.value[1].start, "yyyy/MM/dd")
          : "",
        invalid: false,
      };
      rangeInput2.end = {
        value: modelValue.value[1]
          ? formatDate(modelValue.value[1].end, "yyyy/MM/dd")
          : "",
        invalid: false,
      };
    }

    watch(modelValue, () => {
      dateRange1.value = modelValue.value[0];
      dateRange2.value = modelValue.value[1];
      isCompare.value = !!modelValue.value[1];
    });
    watch(dateRange1, () => {
      rangeInput1.start.value =
        dateRange1.value && dateRange1.value.start
          ? formatDate(dateRange1.value.start, "yyyy/MM/dd")
          : "";
      rangeInput1.start.invalid = !dateRange1.value || !dateRange1.value.start;
      rangeInput1.end.value =
        dateRange1.value && dateRange1.value.end
          ? formatDate(dateRange1.value.end, "yyyy/MM/dd")
          : "";
      rangeInput1.end.invalid = !dateRange1.value || !dateRange1.value.end;

      if (isCompare.value) {
        dateRange2.value = previousDateRange(dateRange1.value);
      }
    });
    watch(dateRange2, () => {
      rangeInput2.start.value =
        dateRange2.value && dateRange2.value.start
          ? formatDate(dateRange2.value.start, "yyyy/MM/dd")
          : "";
      rangeInput2.start.invalid = !dateRange2.value || !dateRange2.value.start;
      rangeInput2.end.value =
        dateRange2.value && dateRange2.value.end
          ? formatDate(dateRange2.value.end, "yyyy/MM/dd")
          : "";
      rangeInput2.end.invalid = !dateRange2.value || !dateRange2.value.end;
    });
    watch(isCompare, () => {
      emit("compare:change", isCompare.value);
      dateRange2.value = isCompare.value
        ? previousDateRange(dateRange1.value)
        : null;
    });

    return {
      el,
      status1,
      dateRange1,
      dateRange2,
      rangeInput1,
      rangeInput2,
      isCompare,
      baseDateString,
      quicks,
      maxDate1,
      range1Status,
      dateRange1Style1,
      dateRange1Style2,
      maxDate2,
      range2Status,
      dateRange2Style1,
      dateRange2Style2,
      isApplyButtonDisabled,
      maxDaysProxy,
      dataSourceTypeString,
      dataDateString,
      minDateNotice,
      minDateProxy,
      onClickedQuick,
      onClickedCancel,
      onClickedApply,
      onRangeInputUpdated,
      reset,
    };
  },
});
</script>

<style lang="stylus">
.calendar-popup
  @apply w-auto py-4 border border-bg rounded-lg bg-white shadow-md overflow-hidden

  .popup-body
    @apply flex s('mb-2.5') divide-x divide-gray-4

  .popup-footer
    @apply s('mx-3.75') border-t border-gray-4 text-center

    .compare
      @apply pt-4 text-base leading-normal text-gray-2

      .range1
        @apply  text-primary font-bold

      .range2
        @apply text-gray-2 font-bold

    .actions
      @apply pt-4 space-x-8

  .quicks
    @apply relative

    .quick-button
      @apply relative block s('w-[7.4375rem]') s('pl-6.5') s('py-2') space-y-1 bg-white text-gray-3 s('hover:bg-bg') s('hover:text-gray-2')

      &.selected
        @apply bg-bg text-primary s('hover:text-primary')

        &:before
          content ''
          @apply block absolute s('top-1/2') s('left-0') s('w-1.5') s('h-1.5') s('ml-3') rounded-full bg-primary transform s('-translate-y-1/2')

      &-title
        @apply text-base

      &-notice
        @apply text-xs

    .quicks-divide
      @apply h-px ml-1 my-1 bg-gray-4
      width calc(100% - theme('spacing.1'))

    .compare-switch
      @apply absolute bottom-0 left-0 s('ml-4.75')

  .calendar
    @apply s('pl-[1.4375rem]') s('pr-6')

    .vc-header
      @apply pt-2

    &-compare
      .calendar-header
        @apply text-gray-2

    &-header
      @apply s('pt-1.5') s('pb-1.75') s('space-y-0.5') border-b border-primary text-sm s('leading-4.75') text-primary

      .date-range
        @apply flex justify-start items-center space-x-1 text-sm

        .text-input
          @apply flex-grow-0 flex-shrink-0 s('w-[6.5rem]')

    &-body
      @apply space-y-2

      .data-date
        @apply text-xs text-gray-2 text-right
</style>
