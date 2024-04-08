<template lang="pug">
a.circle-button(
    href="javascript:;"
    :class="btnClass"
    @click="onClicked"
  )
  SLIcon(v-if="icon !== ''" :icon="icon")
  .badge(v-show="showBadge")
</template>

<script lang="ts">
export default defineComponent({
  name: "SLCircleButton",
  components: {},
  props: {
    size: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "secondary-hover",
    },
    icon: {
      type: String,
      default: "box",
    },
    shadow: {
      type: Boolean,
      default: false,
    },
    showBadge: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const { size, color, shadow, active } = toRefs(props);

    const btnClass = computed(() => {
      const btnClass = [];
      if (size.value !== "") {
        btnClass.push(`circle-button-${size.value}`);
      }
      if (color.value !== "") {
        btnClass.push(`circle-button-${color.value}`);
      }
      if (shadow.value) {
        btnClass.push("shadow");
      }
      if (active.value) {
        btnClass.push("active");
      }
      return btnClass.join(" ");
    });

    function onClicked(e: Event) {
      emit("click", e);
    }

    return {
      btnClass,
      onClicked,
    };
  },
});
</script>

<style lang="stylus">
.circle-button
  @apply inline-flex items-center justify-center relative w-10 h-10 rounded-full bg-white text-xl s('leading-5.75') text-white

  &&-lg
    @apply s('w-13.5') s('h-13.5') s('text-2.67xl')

    .badge
      @apply s('top-1.75') right-3 w-1 h-1

  &&-secondary-hover
    @apply bg-secondary-hover

    &.shadow
      @apply shadow-md

    &.active
      @apply border border-secondary-line text-secondary-line

  .badge
    @apply absolute s('top-1.5') right-2 block s('w-0.75') s('h-0.75') rounded-full bg-secondary-line
</style>
