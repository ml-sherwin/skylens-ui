<template lang="pug">
Transition(
  @before-enter='beforeEnter'
  @enter='enter'
  @after-enter='afterEnter'
  @before-leave='beforeLeave'
  @leave='leave'
  @after-leave='afterLeave'
  :css='false'
)
  .modal(
    v-if="show"
    :class='[{"modal-centered": centered}, modalClass]'
    ref='modal'
  )
    .modal-backdrop(:class='{ show: backdrop }', @click='onClickedModalBackdrop')
    .container.modal-dialog(:class='dialogClasses')
      .modal-content(ref='modalContent')
        header.modal-header(v-if='!!title || closeButton')
          .modal-header-left
            h5.modal-title
              slot(name="title")
                span {{ title }}
              .modal-title-notice(v-if="notice !== ''") {{ notice }}
          .modal-header-right
            slot(name="header-right")
            a.close-button(
              v-if='closeButton',
              href='javascript:;',
              @click='hide'
            )
              SLIcon(icon='times')
        .modal-body.custom-scrollbar-y(ref='modalBodyEl')
          .modal-body-content(ref='modalBodyContentEl')
            slot
        .modal-footer(v-if='$slots.footer')
          slot(name='footer')
  </template>

<script lang="ts">
import { fromEvent, Subscription } from "rxjs";
import { gsap } from "gsap";

export default defineComponent({
  name: "SLModal",
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    centered: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    notice: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
      validator: (val: string) =>
        [
          "",
          "xs",
          "sm",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "4xl",
          "5xl",
          "free",
        ].includes(val),
    },
    closeButton: {
      type: Boolean,
      default: true,
    },
    backdrop: {
      type: Boolean,
      default: false,
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true,
    },
    modalClass: {
      type: [String, Array, Object],
      default: "",
    },
    withScroll: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    "update:show",
    "appearAnimationStart",
    "appearAnimationEnd",
    "leaveAnimationStart",
    "leaveAnimationEnd",
    "scroll",
  ],
  setup(props, { emit }) {
    const { show, centered, size, closeOnBackdrop, withScroll } = toRefs(props);

    const modal = ref<HTMLElement | null>(null);
    const modalContent = ref<HTMLElement | null>(null);
    const modalBodyEl = ref<HTMLElement | null>(null);
    const modalBodyContentEl = ref<HTMLDivElement | null>(null);

    let bodyScrollSubscriber: Subscription | null = null;

    const dialogClasses = computed(() => {
      return [
        {
          "modal-dialog-centered": centered.value,
          [`modal-dialog-${size.value}`]: size.value !== "",
        },
      ];
    });

    function onClickedModalBackdrop() {
      if (!closeOnBackdrop.value) return;

      hide();
    }

    function hide() {
      emit("update:show", false);
    }

    function setupMutation() {
      if (!withScroll.value) return;

      nextTick(() => {
        if (!modalBodyEl.value || bodyScrollSubscriber) return;

        bodyScrollSubscriber = fromEvent(modalBodyEl.value, "scroll", () => {
          console.log("aaa");
          emit("scroll");
        }).subscribe();
      });
    }

    function destroyMutation() {
      if (bodyScrollSubscriber) {
        bodyScrollSubscriber.unsubscribe();
        bodyScrollSubscriber = null;
      }
    }

    function beforeEnter(el: Element) {
      const backdrop = el.querySelector(".modal-backdrop");
      const modalContent = el.querySelector(".modal-content");

      gsap.set(backdrop, { alpha: 0 });
      gsap.set(modalContent, { alpha: 0, y: 50 });
    }

    function enter(el: Element, done: () => void) {
      emit("appearAnimationStart");
      const backdrop = el.querySelector(".modal-backdrop");
      const modalContent = el.querySelector(".modal-content");

      const tl = gsap.timeline({
        onComplete: () => {
          emit("appearAnimationStart");
          done();
        },
      });

      tl.to(
        backdrop,
        {
          alpha: 1,
          duration: 0.5,
        },
        0
      );
      tl.to(
        modalContent,
        {
          y: 0,
          alpha: 1,
          duration: 0.5,
        },
        0.3
      );
    }

    function afterEnter(el: Element) {
      const backdrop = el.querySelector(".modal-backdrop");
      const modalContent = el.querySelector(".modal-content");

      gsap.set(backdrop, { alpha: 1 });
      gsap.set(modalContent, { alpha: 1, y: 0 });
      emit("appearAnimationEnd");
      setupMutation();
    }

    function beforeLeave(el: Element) {
      const backdrop = el.querySelector(".modal-backdrop");
      const modalContent = el.querySelector(".modal-content");

      gsap.set(backdrop, { alpha: 1 });
      gsap.set(modalContent, { alpha: 1 });
    }

    function leave(el: Element, done: () => void) {
      emit("leaveAnimationStart");
      const backdrop = el.querySelector(".modal-backdrop");
      const modalContent = el.querySelector(".modal-content");

      const tl = gsap.timeline({
        onComplete: () => {
          emit("leaveAnimationEnd");
          done();
        },
      });

      tl.to(
        backdrop,
        {
          alpha: 0,
          duration: 0.5,
        },
        0
      );
      tl.to(
        modalContent,
        {
          alpha: 0,
          duration: 0.5,
        },
        0
      );
    }

    function afterLeave(el: Element) {
      const backdrop = el.querySelector(".modal-backdrop");
      const modalContent = el.querySelector(".modal-content");

      gsap.set(backdrop, { alpha: 0 });
      gsap.set(modalContent, { alpha: 0 });
      destroyMutation();
    }

    watch(show, () => {
      if (show.value) {
        setupMutation();
        return;
      }

      destroyMutation();
    });

    onMounted(() => {
      setupMutation();
    });

    onBeforeUnmount(() => {
      destroyMutation();
    });

    return {
      modal,
      modalContent,
      modalBodyEl,
      modalBodyContentEl,
      dialogClasses,
      onClickedModalBackdrop,
      hide,
      beforeEnter,
      enter,
      afterEnter,
      beforeLeave,
      leave,
      afterLeave,
    };
  },
});
</script>

<style lang="stylus" scoped>
.modal
  @apply fixed top-0 left-0 w-full h-full overflow-hidden
  &.modal-centered
    @apply flex items-center

  .modal-backdrop
    @apply absolute top-0 left-0 w-full h-full

    &.show
      @apply s('bg-backdrop/80')

  .modal-dialog
    @apply relative w-full my-7 mx-auto

    &-xs
      @apply s('max-w-[30rem]')

    &-sm
      @apply s("max-w-149.5")

    &-lg
      @apply s('max-w-[39.75rem]')

    &-xl
      @apply s('max-w-[39rem]')
      @apply s("lg:max-w-208")

    &-2xl
      @apply s('max-w-[41rem]')
      @apply s("lg:max-w-[55.125rem]")

    &-3xl
      @apply s('max-w-[748px]')
      @apply s("lg:max-w-[900px]")

    &-4xl
      @apply s('max-w-[697px]')
      @apply s('lg:max-w-[924px]')

    &-5xl
      @apply s('max-w-[748px]')
      @apply s("lg:max-w-[980px]")

    &-free
      @apply w-auto

    &-centered
      @apply flex
      max-height calc(100% - (theme("spacing.7") * 2))

  .modal-content
    @apply flex flex-col w-full max-h-full rounded-lg bg-white shadow-popup-lg

    .modal-header + .modal-body
      @apply rounded-t-none

    .modal-header
      @apply flex-grow-0 flex-shrink-0 flex items-center justify-between py-2 px-4 bg-primary rounded-t-lg text-xl s("leading-6.75") text-white

      &-left
        @apply flex items-center

      &-right
        @apply flex items-baseline ml-6

      .modal-title
        @apply inline-flex items-baseline space-x-2 font-normal

        &-notice
          @apply text-xs font-normal

      .close-button
        @apply inline-flex text-base text-white

        .icon
          @apply inline-flex

    .modal-body
      @apply flex-grow relative w-full pt-4 pr-4 pl-4 bg-white rounded-lg

      &:last-child
        @apply pb-4

    .modal-footer
      @apply flex-grow-0 flex-shrink-0 p-6 rounded-b-lg
</style>
