<template lang="pug">
.month-picker(:class='{ "month-picker--insight-title": color === "insight-title", "month-picker--primary-hover": color === "primary-hover" }')
  .year-select
    a.prev-button(
      href='javascript:;'
      :class='{ disabled: minYear !== null && yearProxy <= minYear }',
      @click='onClickedPrevYear'
    )
      SLIcon(icon='chevron-left')
    .year {{ yearProxy }}
    a.next-button(
      href='javascript:;'
      :class='{ disabled: maxYear !== null && yearProxy >= maxYear }',
      @click='onClickedNextYear'
    )
      SLIcon(icon='chevron-right')
  .month-select
    .month-select-wrapper
      a.month-button(
        v-for='m in 12'
        href='javascript:;'
        :class='{ selected: yearProxy === year && month === m, disabled: (maxYear !== null && maxYear <= yearProxy && maxMonth !== null && m > maxMonth) || (minYear !== null && minYear >= yearProxy && minMonth !== null && m < minMonth)}'
        @click='onClickedMonth(m)'
      ) {{ m }} 月
</template>

<script lang="ts">
import type { PropType } from "vue";

export default defineComponent({
  name: "SLMonthPicker",
  components: {},
  props: {
    color: {
      type: String as PropType<"insight-title" | "primary-hover">,
      validate: (value: string) =>
        ["insight-title", "primary-hover"].includes(value),
    },
    minDate: {
      type: Date as PropType<Date | null>,
      default: () => null,
    },
    maxDate: {
      type: Date as PropType<Date | null>,
      default: () => null,
    },
    modelValue: {
      type: Date as PropType<Date | null>,
      default: () => null,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { minDate, maxDate, modelValue } = toRefs(props);

    const yearProxy = ref(
      modelValue.value?.getFullYear() || new Date().getFullYear()
    );

    const minYear = computed(() => minDate.value?.getFullYear() || null);
    const minMonth = computed(() =>
      minDate.value ? minDate.value.getMonth() + 1 : null
    );
    const maxYear = computed(() => maxDate.value?.getFullYear() || null);
    const maxMonth = computed(() =>
      maxDate.value ? maxDate.value.getMonth() + 1 : null
    );
    const year = computed(() => modelValue.value?.getFullYear() || null);
    const month = computed(() =>
      modelValue.value ? modelValue.value.getMonth() + 1 : null
    );

    function onClickedPrevYear() {
      if (minYear.value !== null && yearProxy.value <= minYear.value) return;
      yearProxy.value -= 1;
    }

    function onClickedNextYear() {
      if (maxYear.value !== null && yearProxy.value >= maxYear.value) return;
      yearProxy.value += 1;
    }

    function onClickedMonth(m: number) {
      emit("update:modelValue", new Date(yearProxy.value, m - 1, 1));
    }

    watch(modelValue, () => {
      yearProxy.value =
        modelValue.value?.getFullYear() || new Date().getFullYear();
    });

    return {
      yearProxy,
      minYear,
      minMonth,
      maxYear,
      maxMonth,
      year,
      month,
      onClickedPrevYear,
      onClickedNextYear,
      onClickedMonth,
    };
  },
});
</script>

<style lang="stylus" scoped>
.month-picker
  @apply s('w-[190px]') space-y-4

  &--insight-title
    .month-select
      &-wrapper
        .month-button
          &.selected
            @apply bg-insight-title

  &--primary-hover
    .month-select
      &-wrapper
        .month-button
          &.selected
            @apply bg-primary-hover

  .year-select
    @apply flex items-center justify-center space-x-10

    .prev-button, .next-button
      @apply inline-flex items-center text-xs text-gray-3

      &.disabled
        @apply text-gray-5 cursor-default

    .year
      @apply text-sm text-gray-2

  .month-select
    &-wrapper
      @apply flex flex-wrap s('-my-2') s('-mx-4')

      .month-button
        @apply flex items-center justify-center s('w-[42px]') s('h-[27px]') s('my-2') s('mx-4') bg-white rounded text-sm text-gray-3
        @apply s('hover:bg-primary-lighter') s('hover:text-white')

        &.selected
          @apply text-white

        &.disabled
          @apply bg-white text-cancel
</style>
