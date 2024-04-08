<template lang="pug">
.month-calendar-button(ref='el')
  a.month-calendar-button-toggle(href='javascript:;', ref='toggleEl', @click='onTogglePopup')
    .toggle-wrapper
      SLIcon(icon='calendar')
      .toggle-divide
      .button-title
        .current-month {{ currentMonthString }}
        .compare-month(v-if='compareMonthString !== ""') v.s. {{ compareMonthString }}
  ClientOnly
    Teleport(to="body")
      .month-calendar-popup(ref='popupEl')
        .popup-header
          .compare-switch
            a.compare-switch-button(
              v-if='enableCompare',
              href='javascript:;',
              :class='{ selected: isCompare }',
              @click='onClickedCompare'
            ) 比較
            a.compare-switch-button(
              href='javascript:;',
              :class='{ selected: !isCompare }',
              @click='onClickedSingle'
            ) 單月
        .popup-body
          SLMonthPicker(
            v-if='isCompare',
            color='primary-hover',
            :min-date='minDate',
            :max-date='maxCompareDate',
            v-model='compareDate',
          )
          .calendar-divide(v-if='isCompare')
          SLMonthPicker(
            color='insight-title',
            :min-date='minDate',
            :max-date="maxDate",
            v-model='currentDate',
          )
        .popup-footer
          a.cancel-button(
            href='javascript:;'
            @click='onClickedCancel'
          ) 取消
          SLButton(
            title='套用',
            size='lg',
            color='primary',
            @click='onClickedApply'
          )
</template>

<script lang="ts">
import type { PropType } from "vue";
import { fromEvent, Subscription } from "rxjs";
import {
  subMonths,
  differenceInCalendarMonths,
  format as formatDate,
} from "date-fns";
import { createPopper } from "@popperjs/core";
import type { Instance as PopperInstance } from "@popperjs/core";
import { gaev, ga4ev } from "~ui/utils";

export default defineComponent({
  name: "SLMonthCalendarButton",
  components: {},
  props: {
    minDate: {
      type: Date as PropType<Date | null>,
      default: () => null,
    },
    maxDate: {
      type: Date as PropType<Date | null>,
      default: () => new Date(),
    },
    modelValue: {
      type: Array as PropType<(Date | null)[]>,
      default: () => [new Date()],
    },
    enableCompare: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { minDate, maxDate, modelValue, enableCompare } = toRefs(props);
    const el = shallowRef<HTMLDivElement | null>(null);
    const toggleEl = shallowRef<HTMLLinkElement | null>(null);
    const popupEl = shallowRef<HTMLDivElement | null>(null);
    const isShowPopup = ref(false);
    const modelValueProxy = ref<(Date | null)[]>([...modelValue.value]);
    const isCompare = ref(
      modelValue.value[1] && enableCompare.value ? true : false
    );

    let popperInstance: PopperInstance | null = null;
    let clickSubscription: Subscription | null = null;

    const currentDate = computed({
      get: () => modelValueProxy.value[0] || null,
      set: (newValue) => {
        modelValueProxy.value = [newValue, modelValueProxy.value[1] || null];
      },
    });
    const compareDate = computed({
      get: () => modelValueProxy.value[1] || null,
      set: (newValue) => {
        modelValueProxy.value = [modelValueProxy.value[0] || null, newValue];
      },
    });
    const maxCompareDate = computed(() => {
      let maxCompareDate: Date | null = null;

      if (currentDate.value) {
        maxCompareDate = subMonths(currentDate.value, 1);
      }

      if (
        maxDate.value &&
        maxCompareDate &&
        differenceInCalendarMonths(maxDate.value, maxCompareDate) < 0
      ) {
        maxCompareDate = maxDate.value;
      }

      return maxCompareDate;
    });
    const currentMonthString = computed(() =>
      modelValue.value[0] ? formatDate(modelValue.value[0], "yyyy/ MM") : ""
    );
    const compareMonthString = computed(() =>
      modelValue.value[1] ? formatDate(modelValue.value[1], "yyyy/ MM") : ""
    );

    function onClickedCompare() {
      gaev({
        category: "Month picker",
        action: "Month picker 切換比較",
        label: "切換比較",
      });
      ga4ev({
        category: "Month picker",
        action: "Month picker 切換比較",
        label: "切換比較",
      });
      isCompare.value = true;
    }

    function onClickedSingle() {
      gaev({
        category: "Month picker",
        action: "Month picker 切換單月",
        label: "切換單月",
      });
      ga4ev({
        category: "Month picker",
        action: "Month picker 切換單月",
        label: "切換單月",
      });
      isCompare.value = false;
    }

    function subscribeClick() {
      clickSubscription = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (
          el.value &&
          !el.value.contains(target as Node) &&
          popupEl.value &&
          !popupEl.value.contains(target as Node)
        ) {
          isShowPopup.value = false;
        }
      });
    }

    function unsubscribeClick() {
      if (clickSubscription) {
        clickSubscription.unsubscribe();
      }
      clickSubscription = null;
    }

    function setupPopper() {
      nextTick(() => {
        if (!toggleEl.value || !popupEl.value || popperInstance) return;

        popperInstance = createPopper(toggleEl.value, popupEl.value, {
          placement: "bottom-end",
          modifiers: [
            { name: "offset", options: { offset: [0, 4] } },
            { name: "eventListeners", enabled: false },
          ],
        });
      });
    }

    function destoryPopper() {
      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;
    }

    function showPopup() {
      if (!popperInstance || !popupEl.value) return;

      subscribeClick();
      popupEl.value.setAttribute("data-show", "");
      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...(options.modifiers || []),
          { name: "eventListeners", enabled: true },
        ],
      }));
      popperInstance.update();
    }

    function hidePopup() {
      if (!popperInstance || !popupEl.value) return;

      unsubscribeClick();
      popupEl.value.removeAttribute("data-show");
      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...(options.modifiers || []),
          { name: "eventListeners", enabled: false },
        ],
      }));
    }

    function onTogglePopup() {
      isShowPopup.value = !isShowPopup.value;
    }

    function onClickedCancel() {
      modelValueProxy.value = [...modelValue.value];
      isShowPopup.value = false;
    }

    function onClickedApply() {
      if (isCompare.value) {
        const compareDate = modelValueProxy.value[1];
        if (minDate.value && compareDate && compareDate < minDate.value) {
          isCompare.value = false;
          emit("update:modelValue", [modelValueProxy.value[0]]);
          return;
        }
        emit("update:modelValue", [...modelValueProxy.value]);
      } else {
        emit("update:modelValue", [modelValueProxy.value[0]]);
      }
      isShowPopup.value = false;
    }

    function setupCompareMonth() {
      if (!currentDate.value) {
        modelValueProxy.value = [];
        return;
      }

      if (!isCompare.value) {
        modelValueProxy.value = [modelValueProxy.value[0]];
        return;
      }

      // if (
      //   compareMonth.value &&
      //   differenceInCalendarMonths(currentMonth.value, compareMonth.value) > 0
      // ) {
      //   return;
      // }

      modelValueProxy.value = [
        modelValueProxy.value[0],
        subMonths(currentDate.value, 1),
      ];
    }

    watch(modelValue, () => {
      modelValueProxy.value = [...modelValue.value];
      isCompare.value =
        modelValue.value[1] && enableCompare.value ? true : false;
    });
    watch(isShowPopup, () => {
      if (isShowPopup.value) {
        showPopup();
        return;
      }

      hidePopup();
    });
    watch(currentDate, () => {
      setupCompareMonth();
    });
    watch(isCompare, () => {
      setupCompareMonth();
    });

    onMounted(() => {
      setupPopper();
    });

    onBeforeUnmount(() => {
      destoryPopper();
    });

    return {
      el,
      toggleEl,
      popupEl,
      isCompare,
      currentDate,
      compareDate,
      maxCompareDate,
      currentMonthString,
      compareMonthString,
      onTogglePopup,
      onClickedCompare,
      onClickedSingle,
      onClickedCancel,
      onClickedApply,
    };
  },
});
</script>

<style lang="stylus" scoped>
.month-calendar-button
  @apply inline-flex

  &-toggle
    @apply inline-flex items-center justify-center s('min-w-[163px]') s('min-h-[58px]') py-1 px-4 bg-white border border-primary-light rounded shadow
    .toggle-wrapper
      @apply inline-flex items-center
      .icon
        @apply text-base leading-none text-primary
      .toggle-divide
        @apply self-stretch w-px ml-4 s('mr-3.75') bg-primary rounded-full
      .button-title
        @apply space-y-1 text-end
        .current-month
          @apply text-lg text-gray-2
        .compare-month
          @apply text-xs text-gray-3
.month-calendar-popup
  @apply z-50 s('p-3.75') space-y-4 bg-white border border-bg rounded-lg shadow-md hidden

  &[data-show]
    @apply block
  .popup-header
    @apply text-center
    .compare-switch
      @apply inline-flex items-center space-x-px
      .compare-switch-button
        @apply block s('py-0.75') s('px-3.75') bg-white border border-primary-lighter text-sm text-insight-title

        &:first-child
          @apply rounded-l s('rounded-r-[1px]')

        &:last-child
          @apply s('rounded-l-[1px]') rounded-r
        &.selected
          @apply bg-insight-title border-insight-title text-white
  .popup-body
    @apply flex
    .calendar-divide
      @apply w-px s('ml-4') s('mr-3.75') bg-gray-4
  .popup-footer
    @apply pt-4 space-x-6 border-t border-gray-4 text-center
    .cancel-button
      @apply text-base text-gray-3
</style>
