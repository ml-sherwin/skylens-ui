<template lang="pug">
.select-all-toggle(:class="[sizeClass, colorClass]")
  a(
    href="javascript:;"
    :class="{ active: status === 'all' }"
    @click="onClickedSelectAll"
  ).select-all-option.select-all-option-all 全選
  .select-all-divider(:class="{ active: status !== '' }")
  a(
    href="javascript:;"
    :class="{ active: status === 'none' }"
    @click="onClickedSelectNone"
  ).select-all-option.select-all-option-none 全不選
</template>

<script lang="ts">
export default defineComponent({
  name: "SLSelectAllToggle",
  components: {},
  props: {
    status: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
      validator: (val: string) => ["", "sm", "xs"].includes(val),
    },
    color: {
      type: String,
      default: "primary-light",
      validator: (val: string) =>
        ["primary-light", "secondary-new"].includes(val),
    },
  },
  emits: ["select:all", "select:none"],
  setup(props, { emit }) {
    const { size, color } = toRefs(props);

    const sizeClass = computed(() => {
      if (size.value === "") return "";

      return `select-all-toggle-${size.value}`;
    });
    const colorClass = computed(() => {
      return `select-all-toggle-${color.value}`;
    });

    function onClickedSelectAll() {
      emit("select:all");
    }

    function onClickedSelectNone() {
      emit("select:none");
    }

    return {
      sizeClass,
      colorClass,
      onClickedSelectAll,
      onClickedSelectNone,
    };
  },
});
</script>

<style lang="stylus">
.select-all-toggle
  @apply inline-flex items-stretch border rounded-sm bg-white overflow-hidden

  &.select-all-toggle-xs
    .select-all-option
      @apply text-xs

  &.select-all-toggle-sm
    .select-all-option
      @apply s('py-1.25') text-xs

  &.select-all-toggle-primary-light
    @apply border-border

    .select-all-option
      @apply text-primary-light

      &.active
        @apply bg-primary

    .select-all-divider
      @apply bg-primary-light

  &.select-all-toggle-secondary-new
    @apply border-secondary-new-300

    .select-all-option
      @apply text-secondary-new-300

      &.active
        @apply bg-secondary-new

    .select-all-divider
      @apply bg-primary-light

  .select-all-option
    @apply block py-1 bg-white text-sm

    &.active
      @apply text-white

    &-all
      @apply px-2

    &-none
      @apply pr-2 s('pl-1.75')

  .select-all-divider
    @apply s('mt-0.5') s('mb-0.5') w-px
</style>
