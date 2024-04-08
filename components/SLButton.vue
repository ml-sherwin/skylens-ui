<template lang="pug">
button(:type='type', :class='btnClass' :disabled="disabled")
  .btn-content
    slot
      SLIcon(v-if='icon !== ""', :icon='icon')
      span(v-if='title !== ""') {{ title }}
      SLIcon(v-if='postIcon !== ""', :icon='postIcon')
  .btn-loading
    .loading
        div
        div
        div
        div
</template>

<script lang="ts">
import type { PropType } from "vue";

export default defineComponent({
  name: "SLButton",
  components: {},
  props: {
    size: {
      type: String,
      default: "",
      validator: (val: string) => ["", "lg", "md", "sm", "xs"].includes(val),
    },
    color: {
      type: String,
      default: "",
      validator: (val: string) =>
        [
          "",
          "white",
          "primary",
          "primary-hover",
          "secondary",
          "third",
          "danger",
          "cancel",
          "gray-2",
          "secondary-new",
          "blue-1",
          "insight-title-line",
        ].includes(val),
    },
    variant: {
      type: String,
      default: "",
      validator: (val: string) => ["", "outline", "icon"].includes(val),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    postIcon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    type: {
      type: String as PropType<"submit" | "reset" | "button">,
      default: "button",
      validator: (val: string) => ["submit", "reset", "button"].includes(val),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { size, color, variant, disabled, loading } = toRefs(props);

    const btnClass = computed(() => {
      const btnClass = ["btn"];
      if (size.value !== "") {
        btnClass.push(`btn-${size.value}`);
      }
      if (color.value !== "") {
        btnClass.push(`btn-${color.value}`);
      }
      if (variant.value !== "") {
        btnClass.push(`btn-${variant.value}`);
      }
      if (disabled.value) {
        btnClass.push("btn-disabled");
      }
      if (loading.value) {
        btnClass.push("loading");
      }

      return btnClass.join(" ");
    });

    return {
      btnClass,
    };
  },
});
</script>

<style lang="stylus">
.btn
  @apply relative inline-flex items-center justify-center s("p-1.75") border border-transparent rounded bg-transparent text-base leading-normal s("focus:outline-none")

  &-lg
    @apply s("px-7.75")

  &-md
    @apply s("px-3.75")

  &-sm
    @apply s("py-0.75") s("px-1.75")

    .btn-content
      @apply space-x-1

  &-xs
    @apply s("py-0.75") s("px-1.75") text-xs

    .btn-content
      @apply space-x-1

  &-white
    @apply bg-white border-white text-gray-2 s("hover:bg-white") s("hover:border-white")

    &.btn-outline
      @apply text-gray-2 s("hover:text-gray-2")

    .btn-loading
      .loading
        div
          border-color white transparent transparent transparent

  &-primary
    @apply bg-primary border-primary text-gray s("hover:bg-primary-hover") s("hover:border-primary-hover")

    &.btn-outline
      @apply text-primary s("hover:text-primary-hover")

    .btn-loading
      .loading
        div
          border-color theme('colors.primary.DEFAULT') transparent transparent transparent

  &-primary-hover
    @apply bg-primary-hover border-primary-hover text-gray s("hover:bg-primary-lighter") s("hover:border-primary-lighter")

    &.btn-outline
      @apply text-primary-hover s("hover:text-primary-lighter")

    .btn-loading
      .loading
        div
          border-color theme('colors.primary.hover') transparent transparent transparent

  &-secondary
    @apply bg-secondary border-secondary text-gray s("hover:bg-secondary-hover") s("hover:text-white") s("hover:border-secondary-hover")

    &.btn-outline
      @apply text-secondary s("hover:text-secondary-hover")

    .btn-loading
      .loading
        div
          border-color theme('colors.secondary.hover') transparent transparent transparent

  &-third
    @apply bg-third-7 border-third-7 text-white s("hover:bg-third-hover") s("hover:text-white") s("hover:border-third-hover")

    &.btn-outline
      @apply text-secondary s("hover:text-secondary-hover")

    .btn-loading
      .loading
        div
          border-color theme('colors.third.hover') transparent transparent transparent

  &-danger
    @apply bg-danger border-danger text-white s("hover:bg-danger-hover") s("hover:border-danger-hover")

    &.btn-outline
      @apply text-danger s("hover:text-danger-hover")

    .btn-loading
      .loading
        div
          border-color theme('colors.danger.hover') transparent transparent transparent

  &-cancel
    @apply bg-cancel border-cancel text-gray-2 s("hover:bg-cancel-hover") s("hover:border-cancel-hover")

    &.btn-outline
      @apply text-cancel s("hover:text-cancel-hover")

    .btn-loading
      .loading
        div
          border-color theme('colors.cancel.hover') transparent transparent transparent

  &-gray-2
    @apply bg-gray-2 border-gray-2 text-white s("hover:bg-gray-3") s("hover:border-gray-3")

    &.btn-outline
      @apply text-gray-2 s("hover:text-gray-3")

    .btn-loading
      .loading
        div
          border-color theme('colors.gray.3') transparent transparent transparent

  &-secondary-new
    @apply bg-secondary-new border-secondary-new text-white s("hover:bg-secondary-new") s("hover:border-secondary-new")

    &.btn-outline
      @apply text-secondary-new s("hover:text-secondary-new")

    .btn-loading
      .loading
        div
          border-color theme('colors.secondary.new') transparent transparent transparent

  &-blue-1
    @apply bg-secondary-new border-secondary-new text-white s("hover:bg-blue-1") s("hover:border-blue-1")

    &.btn-outline
      @apply text-blue-1 s("hover:text-blue-1")

    .btn-loading
      .loading
        div
          border-color theme('colors.blue.1') transparent transparent transparent

  &-insight-title-line
    @apply bg-insight-title-line border-insight-title-line text-white s("hover:bg-insight-title-line") s("hover:border-insight-title-line")

    &.btn-outline
      @apply text-insight-title s("hover:text-insight-title")

    .btn-loading
      .loading
        div
          border-color theme('colors.blue.1') transparent transparent transparent

  &-outline
    @apply bg-transparent border s("hover:bg-white")

  &-disabled
    @apply bg-cancel border-cancel text-white cursor-default s("hover:bg-cancel") s("hover:border-cancel") s("hover:text-white")

    &.btn-outline
      @apply bg-cancel border-cancel text-white s("hover:bg-cancel") s("hover:border-cancel") s("hover:text-white")

    &.btn-icon
      @apply bg-transparent border-transparent text-cancel  s("hover:bg-transparent") s("hover:border-transparent") s("hover:text-cancel")

  &.loading
    @apply bg-line border-line cursor-default

    .btn-content
      @apply opacity-0

    .btn-loading
      @apply block

  .btn-content
    @apply inline-flex items-center space-x-2

  .btn-loading
    @apply absolute s('top-1/2') s('left-1/2') w-4 h-4 s('-translate-x-1/2') s('-translate-y-1/2') pointer-events-none hidden

    .loading
      @apply relative inline-block w-4 h-4

      div
        @apply absolute block w-4 h-4 border-2 rounded-full
        animation loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite

        &:nth-child(1)
          animation-delay -0.45s

        &:nth-child(2)
          animation-delay -0.3s

        &:nth-child(3)
          animation-delay -0.15s

@keyframes loading
  0%
    transform rotate(0deg)

  100%
    transform rotate(360deg)
</style>
