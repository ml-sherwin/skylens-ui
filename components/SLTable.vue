<template lang="pug">
div(ref="el")
  .table(
      :class="{ 'table-responsive': responsive }"
      @mousemove="onMousemoved"
    )
    table
      thead
        slot(name="thead")
          tr
            template(v-for="field, index in fields")
              slot(
                v-if="$slots[`${field.key}-header`]"
                :name="`${field.key}-header`"
                :field="field"
                :index="index"
              )
              th(
                  v-else
                  :style="field._style"
                  :class="[field._class, { sortable: field.sortable, sorting: field.key === sortBy, filterable: field.filterable, filtering: filterBy !== '' }]"
                  :colspan="headerColumnSpans[index]"
                  @click.prevent="onClickedHeaderCol(field.key)"
                  :key="field.key"
                  :name="`${field.key}-header`"
                )
                .inline-flex.items-center
                  SLElementWithTitle(:title="field.tooltip")
                    span {{ field.label ? field.label : '&nbsp;' }}
                  SLIcon.sort-icon(
                    v-if="field.sortable"
                    class="ml-0.5"
                    :icon="sortDesc ? 'descending' : 'ascending'"
                  )
                  SLIcon.filter-icon(
                    v-if="field.filterable"
                    class="ml-0.5"
                    :icon="filterBy !== '' ? 'filter-on' : 'filter'"
                  )
      tbody(:class="{ 'hoverable': hoverableRows, 'clickable': clickableRows }")
        template(v-for="(item, itemIndex) in items" :key="itemIndex")
          tr(
              @click="rowClicked(item, itemIndex, $event)"
              @mouseenter="rowMouseEntered(item, itemIndex, $event)"
              @mouseleave="rowMouseLeaved(item, itemIndex, $event)"
              :tabindex="clickableRows ? 0 : undefined"
              :class="[hoverableRows ? `hover:${tdHoverColor}` : '', `${hoverRowIndex === itemIndex ? tdHoverColor : ''}`, { hover: hoverRowIndex === itemIndex }]"
            )
            template(v-for="(field, index) in fields")
              slot(
                  v-if="$slots[field.key]"
                  :name="field.key"
                  :item="item"
                  :index="itemIndex"
                ).border-border
              td(
                v-else
                :colspan="columnSpans[index]"
                :key="`${itemIndex}-${field.key}`"
                :class='tdBorderColor'
              ) {{ item[field.key] }}
        tr(v-if="items.length === 0")
          td(:colspan="fields.length")
            div(v-if="loading", style="min-height: 200px")
            .flex.flex-col.items-center.py-8.px-4.space-y-3(v-else)
              img(src="~ui/assets/images/commons/empty-box.png")
              .text-lg.text-primary-light {{ noItems }}
              .text-sm.text-gray-3(v-if="reason") 可能的原因：{{ reason }}
    SLLoading(
        v-if="loading"
        :boundaries="[{ sides: ['top'], query: 'td' }, { sides: ['bottom'], query: 'tbody' }]"
      )
  .table-header-filter-popup(ref="popupEl")
    .table-header-filter-popup-content
      a.table-header-filter-item(
        v-for="option in filterOptions"
        href="javascript:;"
        :class="{ active: filterBy === option.key }"
        :key="option.key"
        @click="onClickedFilter(option.key)"
      )
        .inline-flex.items-center.space-x-1
          SLIcon(
            v-if="option.icon"
            :icon="option.icon"
            :class="option._iconClass"
          )
          span(v-if="option.label") {{ option.label }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import { fromEvent, Subscription } from "rxjs";
import { createPopper } from "@popperjs/core";
import type { Instance as PopperInstance } from "@popperjs/core";
import type ITableField from "~ui/interface/ITableField";

export default defineComponent({
  name: "SLTable",
  components: {},
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array as PropType<Array<ITableField>>,
      default: () => [],
    },
    sortBy: {
      type: String,
      default: "",
    },
    sortDesc: {
      type: Boolean,
      default: false,
    },
    filterBy: {
      type: String,
      default: "",
    },
    hoverableRows: {
      type: Boolean,
      default: false,
    },
    clickableRows: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    responsive: {
      type: Boolean,
      default: true,
    },
    tdBorderColor: {
      type: String,
      default: "border-border",
    },
    tdHoverColor: {
      type: String,
      default: "bg-bg",
    },
    noItems: {
      type: String,
      default: "無資料",
    },
    reason: {
      type: String,
      default: "",
    },
  },
  emits: [
    "update:sortDesc",
    "update:sortBy",
    "update:filterBy",
    "row-clicked",
    "row-mouseentered",
    "row-mouseleaved",
    "table-mousemoved",
  ],
  setup(props, { emit }) {
    const { fields, sortBy, sortDesc, clickableRows, hoverableRows } =
      toRefs(props);

    const el = shallowRef<HTMLElement | null>(null);
    const popupEl = shallowRef<HTMLElement | null>(null);
    const hoverRowIndex = ref(-1);
    const filterOptions = ref<
      {
        key: string;
        label?: string;
        icon?: string;
      }[]
    >([]);

    let popperInstance: PopperInstance | null = null;
    let clickSubscriber: Subscription | null = null;
    let filterHeaderCol: HTMLElement | null = null;

    const headerColumnSpans = computed(() => {
      return fields.value.map((field) => {
        if (!field.colspan) return 1;
        return field.colspan;
      });
    });
    const columnSpans = computed(() => {
      return fields.value.map((field) => {
        if (!field.col) return 1;
        if (!field.col.span) return 1;
        return field.col.span;
      });
    });

    function sort(fieldKey: string) {
      if (fieldKey === sortBy.value) {
        emit("update:sortDesc", !sortDesc.value);
      } else {
        emit("update:sortBy", fieldKey);
      }
    }

    function onClickedHeaderCol(fieldKey: string) {
      const field = fields.value.find((f) => f.key === fieldKey);
      if (!field || (!field.sortable && !field.filterable)) return;

      if (field.sortable) {
        sort(field.key);
      }

      if (field.filterable) {
        filterOptions.value = [...field.filterOptions];
        filterHeaderCol = el.value.querySelector(`th[name=${field.key}-header]`)
          .children[0] as HTMLElement;
        show();
      }
    }

    function rowClicked(item: any, index: number, e: Event) {
      if (!clickableRows.value) return;

      emit("row-clicked", item, index, e);
      e.preventDefault();
    }

    function rowMouseEntered(item: any, index: number, e: Event) {
      if (!hoverableRows.value) return;

      hoverRowIndex.value = index;
      emit("row-mouseentered", item, index, e);
    }

    function rowMouseLeaved(item: any, index: number, e: Event) {
      if (!hoverableRows.value) return;

      hoverRowIndex.value = -1;
      emit("row-mouseleaved", item, index, e);
    }

    function onMousemoved(e: Event) {
      if (!hoverableRows.value) return;

      emit("table-mousemoved", e);
    }

    function subscribeClick() {
      clickSubscriber = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (
          filterHeaderCol &&
          popupEl.value &&
          !filterHeaderCol.contains(target as HTMLElement) &&
          !popupEl.value.contains(target as HTMLElement)
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
      if (!popupEl.value || !filterHeaderCol || !popperInstance) return;

      popupEl.value.setAttribute("data-show", "");

      subscribeClick();
      popperInstance.state.elements.reference = filterHeaderCol;
      popperInstance.setOptions({
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
          { name: "eventListeners", enabled: true },
        ],
      });
      popperInstance.update();
    }

    function hide() {
      if (
        !popupEl.value ||
        popupEl.value.getAttribute("data-show") === null ||
        !popperInstance
      )
        return;

      unsubscribeClick();

      if (popupEl.value) {
        popupEl.value.removeAttribute("data-show");
      }

      popperInstance.setOptions({
        modifiers: [{ name: "eventListeners", enabled: false }],
      });
    }

    function onClickedFilter(filterKey: string) {
      emit("update:filterBy", filterKey);
      hide();
    }

    onMounted(() => {
      if (el.value && popupEl.value) {
        popperInstance = createPopper(el.value, popupEl.value, {
          placement: "bottom-end",
          modifiers: [{ name: "eventListeners", enabled: false }],
        });
      }
    });

    onBeforeUnmount(() => {
      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;
    });

    return {
      el,
      popupEl,
      hoverRowIndex,
      filterOptions,
      headerColumnSpans,
      columnSpans,
      onClickedHeaderCol,
      rowClicked,
      rowMouseEntered,
      rowMouseLeaved,
      onMousemoved,
      onClickedFilter,
    };
  },
});
</script>

<style lang="stylus">
.table
  @apply block relative w-full overflow-hidden

  &.table-responsive
    @apply overflow-auto

    table
      @apply table-auto

  table
    @apply w-full table-fixed

    thead
      tr
        @apply border-b border-primary-light bg-white

        th
          @apply px-2 pb-2 text-sm font-normal text-primary whitespace-nowrap
          &.sortable, &.filterable
            @apply cursor-pointer
          .sort-icon, .filter-icon
            @apply opacity-0
          &:hover,
          &.sorting
            .sort-icon
              @apply opacity-100
          &.filterable
            .filter-icon
              @apply opacity-100

    tbody
      &.clickable
        tr
          @apply cursor-pointer

      tr
        td
          @apply p-2 border-b text-sm text-gray-2

.table-header-filter-popup
  @apply z-10 flex border border-primary-light rounded overflow-hidden invisible pointer-events-none

  &[data-show]
    @apply visible pointer-events-auto

  &-content
    @apply flex flex-col

    .table-header-filter-item
      @apply inline-flex justify-center p-2 bg-white text-sm text-gray-3
      @apply s('hover:bg-bg-middle')

      &.active
        @apply bg-bg text-primary

        .icon
          @apply text-primary

      .icon
        @apply text-base leading-none
</style>
