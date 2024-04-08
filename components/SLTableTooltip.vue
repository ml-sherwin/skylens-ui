<template lang="pug">
.table-tooltip
  .table-tooltip-header
    .table-tooltip-title {{ title }}
    .table-tooltip-caption(v-if="caption && caption !== ''") {{ caption }}
  .table-tooltip-body
    .table-toottip-table
      table
        tbody
          template(v-for="item, index in items")
            tr(v-if="formatedDateRanges[index]").date-row
              td(
                colspan="3"
                :class="{'text-gray-3': index + 1 < 2, 'text-primary': index + 1 > 1}"
              ) {{ formatedDateRanges[index] }}
            tr.header-row(:class='headerBorderColor')
              th(v-for="field in fields" :key="field.key") {{ field.label }}
            tr
              td(v-for="field in fields" :key="field.key") {{ item[field.key] }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import { formatDateRange } from "~ui/utils";
import type IDateRange from "~ui/interface/IDateRange";
import type ITableField from "~ui/interface/ITableField";

export default defineComponent({
  name: "SLTableTooltip",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    caption: {
      type: String,
      default: "",
    },
    dateRanges: {
      type: Array as PropType<Array<IDateRange | null>>,
      default: () => [],
    },
    items: {
      type: Array as PropType<{ [key: string]: any }[]>,
      default: () => [],
    },
    fields: {
      type: Array as PropType<Array<ITableField>>,
      default: () => [],
    },
    headerBorderColor: {
      type: String,
      default: "border-primary-light",
    },
  },
  setup(props) {
    const { dateRanges } = toRefs(props);

    const formatedDateRanges = computed(() => {
      if (dateRanges.value.length < 2) return [];

      return dateRanges.value.map((dateRange) => formatDateRange(dateRange));
    });

    return {
      formatedDateRanges,
    };
  },
});
</script>

<style lang="stylus">
.table-tooltip
  @apply inline-block p-4 border border-border rounded bg-white shadow-popup-sm pointer-events-none

  &-title
    @apply mb-4 text-base text-gray-2 font-bold

    &:not(:last-child)
      @apply mb-1

  &-caption
    @apply mb-2 text-sm text-gray-2

  table
    @apply w-full text-base text-gray-2

    tbody
      tr
        &.date-row
          @apply text-gray-3

          td
            @apply pt-4

          &:first-child
            @apply text-primary

            td
              @apply pt-0

          td, th
            @apply text-left

        &.header-row
          @apply border-b

        td, th
          @apply py-1 px-3 text-center
</style>
