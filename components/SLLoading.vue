<template lang="pug">
.loading-modal(:style="{ position: 'absolute', top: containerCoords.top, right: containerCoords.right, bottom: containerCoords.bottom, left: containerCoords.left }" :class="modalClass" ref='el')
  div(:style="{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }")
    .loading
      div
      div
      div
      div
</template>

<script lang="ts">
import type { PropType } from "vue";

export default defineComponent({
  name: "SLLoading",
  components: {},
  props: {
    boundaries: {
      type: Array as PropType<
        Array<{
          sides: ("top" | "right" | "bottom" | "left")[];
          query: string;
        }>
      >,
      default: () => [],
    },
    color: {
      type: String,
      default: "primary",
      validator: (value: string) => ["primary", "secondary"].includes(value),
    },
    bgAlpha: {
      type: Number,
      default: 0.2,
    },
  },
  setup(props) {
    const { boundaries, color } = toRefs(props);

    const el = shallowRef<HTMLElement | null>(null);
    const containerCoords = reactive({
      top: "0px",
      bottom: "0px",
      left: "0px",
      right: "0px",
    });
    const parentCoords = ref<DOMRect | null>(null);

    const modalClass = computed(() => `loading-modal-${color.value}`);

    function setOffsets() {
      const parent = el.value?.parentElement || null;
      if (!parent) return;

      parentCoords.value = parent.getBoundingClientRect();
      boundaries.value.forEach(({ sides, query }) => {
        const element = parent.querySelector(query);
        if (!element || !sides) {
          return;
        }
        const coords = element.getBoundingClientRect();
        sides.forEach((side) => {
          if (!parentCoords.value) return;

          const sideMargin = Math.abs(coords[side] - parentCoords.value[side]);
          containerCoords[side] = sideMargin + "px";
        });
      });
    }

    onMounted(() => {
      if (boundaries.value) {
        setOffsets();
      }
    });

    return {
      el,
      containerCoords,
      parentCoords,
      modalClass,
    };
  },
});
</script>

<style lang="stylus">
.loading-modal
  @apply z-10

  &-primary
    @apply s('bg-primary-lighter/20')

    .loading
      div
        border-color theme('colors.primary.DEFAULT') transparent transparent transparent

  &-secondary
    @apply s('bg-secondary/20')

    .loading
      div
        border-color theme('colors.secondary.DEFAULT') transparent transparent transparent

  .loading
    @apply relative inline-block w-12 h-12

    div
      @apply absolute block w-8 h-8 m-2 border-4 rounded-full
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
