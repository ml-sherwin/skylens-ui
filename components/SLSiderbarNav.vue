<template lang="pug">
.siderbar(:class="{ closure: isClosure, dark }")
  .siderbar-modal(@click="onClickedToggle")
  .siderbar-logo
    a.logo(href="javascript:;" @click="onClickedLogo")
      img.color(src="~ui/assets/images/commons/app-logo.png")
      img.white(src="~ui/assets/images/commons/app-logo-white.png")
  nav.site-nav
    .nav-wrapper.custom-scrollbar-y
      ul(v-if="firstConfig.length > 0")
        SLSiderbarNavItem(
          v-for="item, i in firstConfig"
          :config="item"
          :isSiderbarClosure="isClosure"
          :key="i"
          @toggle="onClickedToggle"
          @click-item="onClickedItem"
        )
  nav.mng-nav
    .nav-wrapper.custom-scrollbar-y
      ul(v-if="secondConfig.length > 0")
        SLSiderbarNavItem(
          v-for="item, i in secondConfig"
          :config="item"
          :isSiderbarClosure="isClosure"
          :key="i"
          @toggle="onClickedToggle"
          @click-item="onClickedItem"
        )
  .siderbar-mode-setting
    .siderbar-mode-setting-title 模式
    SLIOSSwitch(
      :modelValue="dark"
      trueLabel="深色"
      minTrueLabel="深"
      falseLabel="淺色"
      minFalseLabel="淺"
      :size="isClosure ? 'min' : ''"
      @update:modelValue="onUpdatedMode"
    )
  a.siderbar-toggle(href="javascript:;", @click="onClickedToggle")
    SLIcon(icon="chevron-left")
    SLIcon(icon="chevron-right")
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { NavConfigType } from "~ui/interface/NavConfigType";

export default defineComponent({
  name: "SLSidebarNav",
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    firstConfig: {
      type: Array as PropType<NavConfigType>,
      default: () => [],
    },
    secondConfig: {
      type: Array as PropType<NavConfigType>,
      default: () => [],
    },
  },
  emits: ["click:logo", "update:dark", "update:closure", "click:insight"],
  setup(_, { emit }) {
    const isClosure = ref(false);

    function onClickedToggle() {
      isClosure.value = !isClosure.value;
    }

    function onClickedLogo() {
      emit("click:logo");
    }

    function onClickedItem(
      eventName:
        | "click:logo"
        | "update:dark"
        | "update:closure"
        | "click:insight"
    ) {
      emit(eventName);
    }

    function onUpdatedMode(isDark: boolean) {
      emit("update:dark", isDark);
    }

    watch(isClosure, () => {
      emit("update:closure", isClosure.value);
    });

    return {
      isClosure,
      onClickedToggle,
      onClickedLogo,
      onClickedItem,
      onUpdatedMode,
    };
  },
});
</script>

<style lang="stylus">
.siderbar
  @apply relative flex flex-col h-full bg-white shadow transition-all
  width 188px

  &.dark
    @apply bg-primary

    &.closure
      nav
        .siderbar-nav-item
          &.included
            @apply text-primary-hover

            & > .nav-item-container
              .nav-item-wrapper
                @apply bg-card-primary-light

      .siderbar-toggle
        &:hover
          @apply bg-primary-lighter text-white

    .siderbar-logo
      .logo
        img.color
          @apply hidden

        img.white
          @apply block

    nav
      .nav-wrapper.custom-scrollbar-y
        /* Handle */
        &::-webkit-scrollbar-thumb
          @apply bg-primary-hover

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover
          @apply bg-primary-hover

      .siderbar-nav-item
        @apply text-white

        &.highlighted
          @apply text-primary-hover

          & > .nav-item-container
            &:hover
              .nav-item-wrapper
                @apply bg-card-primary-light

            .nav-item-wrapper
              @apply bg-card-primary-light

        .nav-item-container
          &:hover
            .nav-item-wrapper
              @apply bg-primary-hover

          .nav-item-wrapper
            .nav-item-highlight-border
              @apply bg-insight-hint-line

    .siderbar-mode-setting
      @apply text-white

      .ios-switch
        label
          @apply border-primary-hover
          background #2D2F57

          &:before
            @apply border-2 border-primary-hover bg-primary-lighter

    .siderbar-toggle
      @apply bg-primary-lighter text-white

      &:hover
        @apply bg-card-primary-light text-primary

  &.closure
    margin-left -188px

    @media screen and (min-width: 1024px)
      width 86px
      margin-left 0

    .siderbar-modal
      @apply hidden

    .siderbar-toggle
      @apply bg-primary-hover text-white
      margin-right -20px
      border-radius 0px 12px 12px 0px

      &:hover
        @apply bg-primary-lighter text-white

      .icon-chevron-left
        @apply hidden

      .icon-chevron-right
        @apply inline-block

    nav
      .siderbar-nav-item
        &.included
          @apply text-white

          & > .nav-item-container
            .nav-item-wrapper
              @apply bg-primary-hover

        .nav-item-container
          @apply rounded-r-full
          width 37px

          .nav-item-wrapper
            @apply pl-0

            .nav-item-button
              .button-pre-icon
                @apply text-lg
                width 37px
                height 37px

              .button-title
                @apply opacity-0

            .nav-item-toggle
              @apply opacity-0

    .siderbar-mode-setting
      @apply p-0 justify-center space-x-0

      &-title
        @apply hidden

      .ios-switch
        @apply flex-grow-0 flex-shrink-0

  &-modal
    @apply fixed top-0 left-0 w-full h-full bg-white opacity-0
    @apply s('lg:hidden')

  &-logo
    @apply flex-grow-0 flex-shrink-0 relative flex justify-center py-5

    .logo
      @apply block

      img.white
        @apply hidden

  nav + nav
    @apply border-t border-primary-lighter

  nav
    @apply flex-grow relative flex flex-col overflow-hidden

    &.mng-nav
      @apply flex-grow-0 flex-shrink-0 pt-2 mt-auto

    .nav-wrapper
      @apply flex-grow

      &.custom-scrollbar-y
        @apply overflow-hidden s('hover:overflow-auto')

      ul
        @apply flex flex-col space-y-2

    .siderbar-nav-item
      @apply relative flex flex-col items-center w-full text-primary text-base

      &.opened
        .nav-item-toggle
          @apply rotate-90

      &.included
        & > .nav-item-container
          .nav-item-wrapper
            .nav-item-button
              .button-title
                @apply font-bold

      &.highlighted
        @apply text-white

        & > .nav-item-container
          &:hover
            .nav-item-wrapper
              @apply bg-primary-hover

          .nav-item-wrapper
            @apply bg-primary-hover

            .nav-item-button
              .button-title
                @apply font-bold

            .nav-item-highlight-border
              @apply opacity-100

      &.disabled
        .nav-item-wrapper
          .nav-item-button
            @apply cursor-default

          .nav-item-toggle
            @apply text-gray-4 cursor-default


      .nav-item-container
        @apply relative w-full rounded-l-full overflow-hidden transition-siderbar-nav-item
        height 37px

        &:hover
          .nav-item-wrapper
            @apply bg-bg

          .nav-item-button
            @apply font-bold

        .nav-item-wrapper
          @apply absolute top-0 left-0 flex items-center pl-4 transition-padding
          width 188px
          height 37px

          .nav-item-button
            @apply flex-grow flex items-center space-x-2

            .button-pre-icon
              @apply flex-shrink-0 flex-grow-0 flex items-center justify-center text-base leading-none transition-siderbar-nav-item-icon
              width 16px
              height 16px

            .button-title
              @apply flex-grow block truncate opacity-100 transition-opacity

          .nav-item-toggle
            @apply flex-grow-0 flex-shrink-0 inline-flex justify-center items-center w-5 h-5 mr-px text-xs leading-none opacity-100 origin-center transition-opacity

          .nav-item-highlight-border
            @apply flex-grow-0 flex-shrink-0 w-1 h-full bg-primary opacity-0

      .sub-items-wrapper
        @apply w-full h-0 pl-4 overflow-hidden transition-height

        ul
          @apply pt-2

      .siderbar-nav-item
        .nav-item-container
          .nav-item-wrapper
            @apply pl-6
            width 172px

  .siderbar-mode-setting
    @apply flex items-center justify-start mt-6 mb-4 space-x-4 text-base text-primary
    padding-right 10px
    padding-left 40px

    &-title
      @apply flex-grow-0 flex-shrink-0

    .ios-switch
      @apply flex-grow

      label
        @apply border-bg bg-card-primary-light

        &:before
          @apply border-2 border-bg

  &-toggle
    @apply absolute top-0 right-0 flex justify-center items-center bg-bg-middle text-sm text-primary-light leading-none transition-all
    width 20px
    height 40px
    margin-top 25px
    border-radius 12px 0px 0px 12px

    &:hover
      @apply bg-primary-lighter text-white

    .icon-chevron-right
      @apply hidden
</style>
