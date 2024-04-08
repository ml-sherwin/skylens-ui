<template lang="pug">
.pagination
  .pagination-info(v-if="showInfo")
    span 每頁
    SLSelect(
      size='sm'
      placeholder=''
      :modelValue='perPage'
      :options='perPageOptions'
      placement='bottom'
      @update:modelValue='onChangedPerPage'
    )
    span 筆， 共 {{ total }} 筆
  .pagination-items
    a(
        v-if="page > 1 && total > 0 && totalPages > 5"
        href="javascript:;"
        @click="gotoPage(1)"
      ).pagination-item.pagination-item--icon
      SLIcon(icon="angle-double-left")
    a(
        v-if="page > 1 && total > 0"
        href="javascript:;"
        @click="backwardPage"
      ).pagination-item.pagination-item--icon
      SLIcon(icon="chevron-left")
    a(
        v-for="item, i in pageItems"
        href="javascript:;"
        :class="{ active: page === item, more: item === '...' }"
        :key="`${item}${i + 1}`"
        @click="gotoPage(item)"
      ).pagination-item {{ item }}
    a(
        v-if="page < totalPages && total > 0"
        href="javascript:;"
        @click="forwardPage"
      ).pagination-item.pagination-item--icon
      SLIcon(icon="chevron-right")
    a(
        v-if="page < totalPages && total > 0 && totalPages > 5"
        href="javascript:;"
        @click="gotoPage(totalPages)"
      ).pagination-item.pagination-item--icon
      SLIcon(icon="angle-double-right")
</template>

<script lang="ts">
export default defineComponent({
  name: "SLPagination",
  components: {},
  props: {
    total: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 8,
    },
    page: {
      type: Number,
      default: 1,
    },
    showInfo: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:page", "update:perPage"],
  setup(props, { emit }) {
    const { total, perPage, page } = toRefs(props);

    const basePerPage = perPage.value;

    const totalPages = computed(() => {
      return Math.ceil(total.value / perPage.value);
    });
    const pageItems = computed(() => {
      const items = [];
      let from = 0;
      let to = 0;
      if (page.value >= 3) {
        items.push("...");
      }

      if (page.value - 1 <= 0) {
        from = 1;
        to = Math.min(3, totalPages.value);
      } else if (page.value + 1 > totalPages.value) {
        from = Math.max(1, page.value - 2);
        to = page.value;
      } else {
        from = Math.max(1, page.value - 1);
        to = Math.min(totalPages.value, page.value + 1);
      }

      for (let i = from; i <= to; i += 1) {
        items.push(i);
      }

      if (totalPages.value - page.value >= 2) {
        items.push("...");
      }
      return items;
    });
    const perPageOptions = computed(() => [
      { label: basePerPage, value: basePerPage },
      { label: basePerPage * 2, value: basePerPage * 2 },
      { label: basePerPage * 4, value: basePerPage * 4 },
    ]);

    function gotoPage(newPage: number | string) {
      if (typeof newPage !== "number") {
        return;
      }

      emit("update:page", newPage);
    }

    function backwardPage() {
      gotoPage(page.value - 1);
    }

    function forwardPage() {
      gotoPage(page.value + 1);
    }

    function onChangedPerPage(newPerPage: number) {
      emit("update:perPage", newPerPage);
    }

    return {
      totalPages,
      pageItems,
      perPageOptions,
      gotoPage,
      backwardPage,
      forwardPage,
      onChangedPerPage,
    };
  },
});
</script>

<style lang="stylus">
.pagination
  @apply flex items-center justify-end

  &-info
    @apply inline-flex items-center mr-4 s('space-x-0.5') text-base text-gray-2

    .custom-select
      @apply s('min-w-[2.3125rem]')

      .form-control
        label
          @apply text-center

          .icon
            @apply hidden

      .select-options
        .option-list
          .option-button
            @apply s('min-w-0') text-center

  &-items
    @apply inline-flex items-center

  &-item + &-item
    @apply border-l

  &-item
    @apply inline-flex items-center justify-center s('min-w-[1.5rem]') s('min-h-[1.5rem]') p-1 border-t border-b border-primary bg-white text-xs text-primary
    @apply s('hover:text-primary-hover') s('focus:text-primary')

    &--icon
      @apply s('py-1.5')

    &:first-child
      @apply border-l rounded-l-sm

    &:last-child
      @apply border-r rounded-r-sm

    &.active
      @apply bg-primary text-white

    &.more
      @apply cursor-default s('hover:text-primary-hover')
</style>
