<template lang="pug">
.info-tip(:class='{ "info-tip--xs": size === "xs" }')
  a(
    href="javascript:;"
    @mouseenter="onInfoMouseEntered"
    @mouseleave="onInfoMouseLeaved"
    ref="toggleEl"
  ).info-tip-toggle
    slot(name='toggle')
      SLIcon(icon="info-circle")
    .info(
      :class="{ pinned: isPinned }"
      ref="popupEl"
    )
      .info-content(
        :style="{ 'max-width': `${maxWidth}px`, 'min-width': `${minWidth}px` }"
      )
        slot {{ info }}
        a.pin-toggle(
          v-if='pinnable'
          href="javascript:;"
          @click="togglePin"
        )
          SLIcon(icon="pin-line")
</template>

<script lang="ts">
import { fromEvent, interval } from "rxjs";
import { debounce, startWith } from "rxjs/operators";
import { createPopper } from "@popperjs/core";
import type { Placement } from "@popperjs/core";

export default defineComponent({
  name: "SLInfoTip",
  components: {},
  props: {
    info: {
      type: String,
      default: "",
    },
    placement: {
      type: String as PropType<Placement>,
      default: "right-start",
    },
    size: {
      type: String as PropType<"" | "xs">,
      default: "",
    },
    pinnable: {
      type: Boolean,
      default: true,
    },
    minWidth: {
      type: Number,
      default: 0,
    },
  },
  emits: ["infoTip:mouseenter"],
  setup(props, { slots, emit }) {
    const { info, placement } = toRefs(props);

    const toggleEl = shallowRef<HTMLLIElement | null>(null);
    const popupEl = shallowRef<HTMLLIElement | null>(null);
    const maxWidth = ref(480);
    const isPinned = ref(false);

    let popperInstance: any = null;
    let resizeSubscriber: any = null;

    function subscribeResize() {
      resizeSubscriber = fromEvent(window, "resize")
        .pipe(debounce(() => interval(500)))
        .pipe(startWith(0))
        .subscribe(() => {
          const toggleRect = toggleEl.value?.getBoundingClientRect() || null;
          const windowWidth = window.innerWidth;

          if (!toggleRect) return;

          maxWidth.value = Math.min(
            365,
            windowWidth - toggleRect.left - toggleRect.width - 11
          );
        });
    }

    function unsubscribeResize() {
      if (resizeSubscriber) {
        resizeSubscriber.unsubscribe();
      }
      resizeSubscriber = null;
    }

    function show() {
      if (!popupEl.value) return;

      popupEl.value.setAttribute("data-show", "");

      popperInstance.setOptions({
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 0],
            },
          },
          { name: "eventListeners", enabled: true },
        ],
      });

      popperInstance.update();
    }

    function hide() {
      if (!popupEl.value || popupEl.value.getAttribute("data-show") === null)
        return;
      popupEl.value.removeAttribute("data-show");
      popperInstance.setOptions({
        modifiers: [{ name: "eventListeners", enabled: false }],
      });
    }

    function onInfoMouseEntered() {
      emit("infoTip:mouseenter");
      show();
    }

    function onInfoMouseLeaved() {
      hide();
    }

    function togglePin() {
      isPinned.value = !isPinned.value;
    }

    onMounted(() => {
      if (info.value === "" && !slots.default) {
        return;
      }

      if (toggleEl.value && popupEl.value) {
        popperInstance = createPopper(toggleEl.value, popupEl.value, {
          placement: placement.value,
          modifiers: [{ name: "eventListeners", enabled: false }],
        });
      }

      subscribeResize();
    });

    onBeforeUnmount(() => {
      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;

      unsubscribeResize();
    });

    return {
      toggleEl,
      popupEl,
      maxWidth,
      isPinned,
      onInfoMouseEntered,
      onInfoMouseLeaved,
      togglePin,
    };
  },
});
</script>

<style lang="stylus">
.info-tip
  @apply inline-flex ml-2 text-base s('leading-4.5') text-primary s('hover:text-primary-hover') cursor-default

  &--xs
    @apply ml-1 text-xs

  .info-tip-toggle
    @apply inline-flex cursor-default

  .info
    @apply z-10 absolute invisible

    &[data-popper-placement^='bottom']
      @apply pt-1

    &[data-popper-placement^='right']
      @apply pl-3

    &[data-show], &.pinned
      @apply visible

    &.pinned
      .info-content
        .pin-toggle
          &:hover
            .icon
              &:before
                content '\e943'

          .icon
            &:before
              content '\e943'

    &-content
      @apply relative flex py-5 pl-4 pr-6 border s('border-border/50') rounded-lg bg-white text-sm text-gray-2 font-normal shadow-popup-sm

      .pin-toggle
        @apply absolute top-0 right-0 mt-2 mr-2 text-base text-primary-hover

        &:hover
          .icon
            &:before
              content '\e967'

        .icon
          &:before
            content '\e980'
</style>
