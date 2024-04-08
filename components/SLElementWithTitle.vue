<template lang="pug">
.element-with-title(
  @mouseenter="onMouseEnter"
  @mouseleave="onMouseLeave"
  @mousemove="onMouseMove"
  ref="el"
)
  slot
  .element-with-title-tooltip(
    v-if="title !== '' || $slots.title"
    :style="`max-width: ${maxWidth}px`"
    ref="tooltipEl"
  )
    slot(name="title") {{ title }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import { createPopper } from "@popperjs/core";
import type {
  VirtualElement,
  Placement,
  Instance as PopperInstance,
} from "@popperjs/core";

export default defineComponent({
  name: "SLElementWithTitle",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    placement: {
      type: String as PropType<Placement>,
      default: "bottom-start",
    },
    maxWidth: {
      type: [Number, String],
      default: "none",
    },
  },
  setup(props) {
    const { title, placement } = toRefs(props);

    const el = shallowRef<HTMLElement | null>(null);
    const tooltipEl = shallowRef<HTMLElement | null>(null);
    const mouseX = ref(0);
    const mouseY = ref(0);

    let popperInstance: PopperInstance | null = null;

    const virtualElement = computed(() => {
      return {
        getBoundingClientRect: () => {
          return {
            width: 0,
            height: 0,
            top: mouseY.value,
            right: mouseX.value,
            bottom: mouseY.value,
            left: mouseX.value,
          };
        },
      } as VirtualElement;
    });

    async function createTipPopper() {
      await nextTick();
      destroyPopper();
      if (!virtualElement.value || !tooltipEl.value) return;

      popperInstance = createPopper(virtualElement.value, tooltipEl.value, {
        placement: placement.value,
        strategy: "fixed",
        modifiers: [{ name: "eventListeners", enabled: false }],
      });
    }

    function destroyPopper() {
      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;
    }

    function show() {
      if (!tooltipEl.value || !popperInstance) return;
      const appWrapperEl = document.querySelector(".app-wrapper");

      tooltipEl.value.setAttribute("data-show", "");
      popperInstance.setOptions({
        modifiers: [
          {
            name: "offset",
            options: {
              offset: placement.value === "bottom-start" ? [-8, 18] : [0, 0],
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: appWrapperEl,
              padding: 16,
            },
          },
          { name: "eventListeners", enabled: true },
        ],
      });
      popperInstance.update();
    }

    function hide() {
      if (
        !tooltipEl.value ||
        tooltipEl.value.getAttribute("data-show") === null ||
        !popperInstance
      )
        return;
      tooltipEl.value.removeAttribute("data-show");
      popperInstance.setOptions({
        modifiers: [{ name: "eventListeners", enabled: false }],
      });
    }

    function onMouseEnter(e: MouseEvent) {
      show();
    }

    function onMouseLeave(e: MouseEvent) {
      hide();
    }

    function onMouseMove(e: MouseEvent) {
      mouseX.value = e.clientX;
      mouseY.value = e.clientY;

      nextTick(() => {
        if (popperInstance) {
          popperInstance.update();
        }
      });
    }

    watch(title, () => {
      if (title.value) {
        createTipPopper();
      } else {
        destroyPopper();
      }
    });

    onMounted(() => {
      createTipPopper();
    });

    onBeforeUnmount(() => {
      destroyPopper();
    });

    return {
      el,
      tooltipEl,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
    };
  },
});
</script>

<style lang="stylus">
.element-with-title
  @apply inline-flex

  &-tooltip
    @apply s('z-[10]') p-2 s('bg-backdrop/70') rounded text-xs text-white whitespace-pre shadow invisible pointer-events-none

    &[data-show]
      @apply visible
</style>
