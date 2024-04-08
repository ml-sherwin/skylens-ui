<template lang="pug">
a.icon-btn(
  href='javascript:;'
  :class='btnClass'
  :style='`width: ${btnWidth}px`'
  @click.prevent='onClicked'
  @mouseenter.prevent='onMouseEnter'
  @mouseleave.prevent='onMouseLeave'
)
  SLIcon(:icon='icon')
  .icon-btn-title(ref='titleEl') {{ title }}
</template>

<script lang="ts">
export default defineComponent({
  name: "SLIconButton",
  components: {},
  props: {
    size: {
      type: String,
      default: "",
      validator: (val: string) => [""].includes(val),
    },
    color: {
      type: String,
      default: "",
      validator: (val: string) =>
        ["", "primary", "secondary-new"].includes(val),
    },
    variant: {
      type: String,
      default: "",
      validator: (val: string) => ["", "outline"].includes(val),
    },
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const { size, color, variant } = toRefs(props);

    const titleEl = shallowRef<HTMLDivElement | null>(null);
    const btnWidth = ref(0);

    const btnClass = computed(() => {
      const btnClass = [];
      if (size.value !== "") {
        btnClass.push(`icon-btn--${size.value}`);
      }
      if (color.value !== "") {
        btnClass.push(`icon-btn--${color.value}`);
      }
      if (variant.value !== "") {
        btnClass.push(`icon-btn--${variant.value}`);
      }

      return btnClass.join(" ");
    });

    function initBtnWidth() {
      nextTick(() => {
        btnWidth.value = 10.5 * 2 + 16;
      });
    }

    function onClicked() {
      emit("click");
    }

    function onMouseEnter() {
      if (!titleEl.value) return;

      const titleRect = titleEl.value.getBoundingClientRect();
      btnWidth.value = 10.5 * 2 + 16 + titleRect.width;
    }

    function onMouseLeave() {
      initBtnWidth();
    }

    onMounted(() => {
      initBtnWidth();
    });

    return {
      titleEl,
      btnWidth,
      btnClass,
      onClicked,
      onMouseEnter,
      onMouseLeave,
    };
  },
});
</script>

<style lang="stylus" scoped>
.icon-btn
  @apply inline-flex flex-nowrap justify-start items-center s('p-[0.59375rem]') border rounded-full text-base text-white overflow-hidden transition-width duration-300
  &:hover
    .icon-btn-title
      @apply opacity-100

  &.icon-btn--primary
    @apply bg-primary border-primary

    &.icon-btn--outline
      @apply text-primary

  &.icon-btn--secondary-new
    @apply bg-secondary-new border-secondary-new

    &.icon-btn--outline
      @apply text-secondary-new

  &.icon-btn--outline
    @apply bg-transparent

  .icon
    @apply flex-grow-0 flex-shrink-0

  &-title
    @apply flex-grow-0 flex-shrink-0 pl-2 opacity-0 transition-opacity duration-300
</style>
