<template lang="pug">
a.popup-menu-button(
  href='javascript:;'
  @click='onClickedToggle'
  ref='toggleEl'
)
  SLIcon(icon='three-dot-v')
  ClientOnly
    Teleport(to="body")
      .buttons-popup(ref='popupEl')
        template(
          v-for='button, i in buttons'
        )
          a.menu-button(
            href='javascript:;'
            @click='onClickedMenuButton(button.event)'
          )
            SLIcon(:icon='button.icon')
            span {{ button.name }}
          .menu-button-splitter(v-if='(i + 1) < buttons.length')
</template>

<script lang="ts">
import type { PropType } from "vue";
import { fromEvent } from "rxjs";
import { createPopper } from "@popperjs/core";
import type { Options as PopperOptions } from "@popperjs/core";
import type IPopupMenuButton from "~ui/interface/IPopupMenuButton";

export default defineComponent({
  name: "SLPopupMenuButton",
  components: {},
  props: {
    buttons: {
      type: Array as PropType<Array<IPopupMenuButton>>,
      default: () => [],
    },
  },
  setup(_, { emit }) {
    const toggleEl = shallowRef<HTMLElement | null>(null);
    const popupEl = shallowRef<HTMLElement | null>(null);
    const isShow = ref(false);

    let popperInstance: any = null;
    let clickSubscriber: any = null;

    function unsubscribeClick() {
      if (clickSubscriber) {
        clickSubscriber.unsubscribe();
      }
      clickSubscriber = null;
    }

    function show() {
      isShow.value = true;
      if (popupEl.value) {
        popupEl.value.setAttribute("data-show", "");
      }
      popperInstance.setOptions((options: PopperOptions) => ({
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 2],
            },
          },
          { name: "eventListeners", enabled: true },
        ],
      }));
      popperInstance.update();

      clickSubscriber = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (toggleEl.value && !toggleEl.value.contains(target as HTMLElement)) {
          hide();
        }
      });
    }

    function hide() {
      isShow.value = false;
      unsubscribeClick();
      if (popupEl.value) {
        popupEl.value.removeAttribute("data-show");
      }

      if (popperInstance) {
        popperInstance.setOptions((options: PopperOptions) => ({
          modifiers: [{ name: "eventListeners", enabled: false }],
        }));
      }
    }

    function onClickedToggle() {
      if (!isShow.value) {
        show();
      } else {
        hide();
      }
    }

    function onClickedMenuButton(eventType: string) {
      emit(eventType);
    }

    onMounted(() => {
      nextTick(() => {
        if (toggleEl.value && popupEl.value) {
          popperInstance = createPopper(toggleEl.value, popupEl.value, {
            placement: "bottom-end",
            modifiers: [{ name: "eventListeners", enabled: false }],
          });
        }
      });
    });

    onBeforeUnmount(() => {
      unsubscribeClick();
      if (popperInstance) {
        popperInstance.destroy();
      }

      popperInstance = null;
    });

    return {
      toggleEl,
      popupEl,
      onClickedToggle,
      onClickedMenuButton,
    };
  },
});
</script>

<style lang="stylus">
.popup-menu-button
  @apply inline-block relative

.buttons-popup
  @apply z-60 flex-col items-stretch border border-primary-lighter rounded bg-white shadow-md hidden

  &[data-show]
    @apply flex

  .menu-button
    @apply inline-flex flex-row flex-nowrap items-center justify-center px-2 py-1 space-x-2 text-base text-primary whitespace-nowrap

    &:first-child
      @apply pt-2

    &:last-child
      @apply pb-2

  .menu-button-splitter
    @apply h-px mx-auto my-1 bg-bg
    width calc(100% - theme("spacing.4"))
</style>
