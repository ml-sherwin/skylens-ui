<template lang="pug">
a.sl-toggle-button(
  href="javascript:;"
  :class="[{ active: isActive, disabled: isDisabled }, sizeClass]"
  data-skip-download
  @click.prevent="onClicked"
)
  SLIcon(:icon="icon")
  span(v-if="title !== ''") {{ title }}
</template>

<script lang="ts">
export default defineComponent({
  name: "SLToggleButton",
  components: {},
  props: {
    icon: {
      type: String,
      default: "chart_with_num",
    },
    title: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "",
      validator: (val: string) => ["", "sm"].includes(val),
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const { isDisabled, size } = toRefs(props);

    const sizeClass = computed(() => {
      if (size.value === "") return "";

      return `sl-toggle-button-${size.value}`;
    });

    function onClicked(e: MouseEvent) {
      if (isDisabled.value) return;

      emit("click", e);
    }

    return {
      sizeClass,
      onClicked,
    };
  },
});
</script>

<style lang="stylus">
.sl-toggle-button
  @apply inline-flex items-center justify-center s('p-1.5') space-x-2 bg-bg rounded text-base text-primary-hover

  &.sl-toggle-button-sm
    @apply s('h-[29px]') px-1 py-0 text-sm

    .icon
      @apply text-lg leading-none

  &.active
    @apply bg-primary-hover text-white

  &.disabled
    @apply bg-cancel text-white cursor-default
</style>
