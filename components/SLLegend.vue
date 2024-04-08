<template lang="pug">
.chart-legend
  a.chart-legend-item(
    v-for='(item, index) in items',
    href='javascript:;',
    :class='{ unactive: !item.active }',
    :key='item.key',
    @click='onClickedItem(item, index, $event)',
    @mouseenter='onMouseEnterItem(item, index, $event)',
    @mouseleave='onMouseLeaveItem(item, index, $event)'
  )
    SLIcon.item-icon(
      v-if='item.icon',
      :icon='item.icon',
      :style='{ color: item.active ? item.color : "#E0E0E0" }',
    )
    span.item-marker(
      v-else
      :style='{ background: item.active ? item.color : "#E0E0E0" }'
    )
    span {{ item.name }}
  slot(name="custom-item")
</template>

<script lang="ts">
import type { PropType } from "vue";
import type ILegendItem from "~ui/interface/ILegendItem";

export default defineComponent({
  name: "SLLegend",
  components: {},
  props: {
    items: {
      type: Array as PropType<Array<ILegendItem>>,
      default: () => [],
    },
  },
  emits: ["toggle", "enter", "leave"],
  setup(_, { emit }) {
    function onClickedItem(item: ILegendItem, index: number, e: Event) {
      emit("toggle", item, index, e);
    }

    function onMouseEnterItem(item: ILegendItem, index: number, e: Event) {
      emit("enter", item, index, e);
    }

    function onMouseLeaveItem(item: ILegendItem, index: number, e: Event) {
      emit("leave", item, index, e);
    }

    return {
      onClickedItem,
      onMouseEnterItem,
      onMouseLeaveItem,
    };
  },
});
</script>

<style lang="stylus">
.chart-legend
  @apply text-center

  &-item
    @apply inline-flex items-center mx-2 text-base text-gray-2

    &.unactive
      @apply text-cancel

    .item-icon
      @apply mr-1

    .item-marker
      @apply inline-block w-3 h-3 mr-1 rounded-full
</style>
