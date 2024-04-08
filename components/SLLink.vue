<template lang="pug">
a.sl-link(
  href="javascript:;"
  @mouseenter="onMouseEnter"
  @mouseleave="onMouseLeave"
  @mousemove="onMouseMove"
)
  slot
  .sl-link-tooltip(
    v-if="title !== ''"
    ref="tooltipEl"
  ) {{ title }}
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
  name: "SLLink",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    placement: {
      type: String as PropType<Placement>,
      default: "bottom",
    },
  },
  setup(props) {
    const { placement } = toRefs(props);

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

    function createTipPopper() {
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
      tooltipEl.value.setAttribute("data-show", "");
      popperInstance.setOptions({
        modifiers: [
          {
            name: "offset",
            options: {
              offset: placement.value === "bottom" ? [0, 18] : [0, 0],
            },
          },
          // {
          //   name: 'flip',
          //   options: {
          //     boundary: boundaryTarget,
          //   },
          // },
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

    onMounted(() => {
      createTipPopper();
    });

    onBeforeUnmount(() => {
      destroyPopper();
    });

    return {
      tooltipEl,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
    };
  },
});
</script>

<style lang="stylus">
.sl-link
  *
    @apply pointer-events-none

  &-tooltip
    @apply p-1 bg-gray-2 text-xs text-white whitespace-nowrap shadow invisible

    &[data-show]
      @apply visible
</style>
