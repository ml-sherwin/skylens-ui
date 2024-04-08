<template lang="pug">
.calendar-button(ref="button")
  a(
      href="javascript:;"
      @click="onClickedToggle"
      ref="toggle"
    ).toggle-button
    .date-range
      SLIcon(icon="calendar")
      span.divider
      span.date-range {{ dateRange1 }}
      span.range-days(v-if='dateRange1Days') {{ dateRange1Days }} 天
    .compare-date-range(v-if="dateRange2 && showCompareSwitch")
      span v.s.
      span {{ dateRange2 }}
  ClientOnly
    Teleport(to="body")
      SLCalendarPopup(
          :data-source-type='dataSourceType'
          :show-quicks="showQuicks"
          :showCompareSwitch="showCompareSwitch"
          :min-date="minDate"
          :maxDate="maxDate"
          :maxDays="maxDays"
          :modelValue="modelValue"
          @compare:change="onCompareChanged"
          @update:modelValue="onInputed"
          ref="popup"
        )
</template>

<script lang="ts">
import { SLCalendarPopup } from "#components";
import type { PropType } from "vue";
import { fromEvent } from "rxjs";
import { differenceInCalendarDays, subDays } from "date-fns";
import { createPopper } from "@popperjs/core";
import type { Placement } from "@popperjs/core";
import DateRange from "~ui/models/DateRange";
import type IDateRange from "~ui/interface/IDateRange";
import { OnlineSourceType } from "~ui/interface/IWeb";

type SLCalendarPopupType = InstanceType<typeof SLCalendarPopup>;

export default defineComponent({
  name: "SLCalendarButton",
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
      default: 365,
    },
    modelValue: {
      type: Array as PropType<Array<IDateRange | null>>,
      default: () => [
        { start: new Date(2020, 8, 11), end: new Date(2020, 8, 17) },
      ],
    },
    placement: {
      type: String,
      default: "bottom-start",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue, placement } = toRefs(props);

    const button = shallowRef<HTMLElement | null>(null);
    const toggle = shallowRef<HTMLElement | null>(null);
    const popup = shallowRef<SLCalendarPopupType | null>(null);

    let popperInstance: any = null;
    let clickSubscriber: any = null;

    const dateRange1 = computed(() => {
      const [dateRange1] = modelValue.value;
      if (!dateRange1) {
        return null;
      }
      return new DateRange(dateRange1.start, dateRange1.end);
    });
    const dateRange2 = computed(() => {
      const [, dateRange2] = modelValue.value;
      if (!dateRange2) {
        return null;
      }
      return new DateRange(dateRange2.start, dateRange2.end);
    });
    const dateRange1Days = computed(() => {
      if (!dateRange1.value || !dateRange1.value.start || !dateRange1.value.end)
        return 0;

      return (
        differenceInCalendarDays(dateRange1.value.end, dateRange1.value.start) +
        1
      );
    });

    function subscribeClick() {
      clickSubscriber = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (
          button.value &&
          !button.value.contains(target as Node) &&
          popup.value &&
          !popup.value.$el.contains(target as Node)
        ) {
          hide();
        }
      });
    }

    function unsubscribeClick() {
      if (clickSubscriber) {
        clickSubscriber.unsubscribe();
      }
      clickSubscriber = null;
    }

    function show() {
      if (!popup.value) return;

      subscribeClick();
      popup.value.$el.setAttribute("data-show", "");

      popperInstance.setOptions({
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
          { name: "eventListeners", enabled: true },
        ],
      });

      popperInstance.update();
    }

    function hide() {
      if (!popup.value || popup.value.$el.getAttribute("data-show") === null)
        return;
      unsubscribeClick();
      popup.value.$el.removeAttribute("data-show");
      popperInstance.setOptions({
        modifiers: [{ name: "eventListeners", enabled: false }],
      });
      nextTick(() => {
        if (popup.value) {
          popup.value.reset();
        }
      });
    }

    function onClickedToggle() {
      if (!popup.value || popup.value.$el.getAttribute("data-show") !== null) {
        hide();
        return;
      }
      show();
    }

    function onInputed(value: Array<IDateRange>) {
      emit("update:modelValue", value);
      hide();
    }

    function onCompareChanged() {
      popperInstance.update();
    }

    onMounted(() => {
      nextTick(() => {
        if (button.value && popup.value && popup.value.$el) {
          popperInstance = createPopper(
            button.value,
            popup.value.$el as HTMLElement,
            {
              placement: placement.value as Placement,
              modifiers: [{ name: "eventListeners", enabled: false }],
            }
          );
        }
      });
    });

    onBeforeUnmount(() => {
      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;
    });

    return {
      button,
      toggle,
      popup,
      dateRange1,
      dateRange2,
      dateRange1Days,
      onClickedToggle,
      onInputed,
      onCompareChanged,
      hide,
    };
  },
});
</script>

<style lang="stylus" scoped>
.calendar-button
  @apply inline-block

  .toggle-button
    @apply inline-flex flex-col justify-center s('px-2.75')  space-y-1 border s('border-white/20') rounded bg-white text-sm leading-normal text-gray-2
    height 58px

    .date-range
      @apply flex items-center

      .icon
        @apply flex-grow-0 flex-shrink-0 text-base text-primary leading-none

      .divider
        @apply flex-grow-0 flex-shrink-0 block w-px s('h-4.75') ml-2 s('mr-1.75') bg-primary

      .range-days
        @apply block s('ml-0.5') px-1 s('py-0.5') bg-bg-middle rounded text-xs text-primary

    .compare-date-range
      @apply pl-1 space-x-2 text-sm text-gray-3

.calendar-popup
  @apply z-60 absolute invisible pointer-events-none

  &[data-show]
    @apply visible pointer-events-auto
</style>
