<template lang="pug">
.sl-collapsable-block(:class="{ collapsed: isCollapsed }")
  .sl-collapsable-block-header
    slot(name="header")
      a(
        href="javascript:;"
        @click="onToggleCollapse"
      ).flex.items-center.justify-between
        .text-base.text-gray-1.font-bold {{ blockTitle }}
        .toggle-collapse-button
          .button-title {{ isCollapsed ? '展開' : '收合' }}
          SLIcon(icon="chevron-down")
  .sl-collapsable-block-body(:style="`height: ${bodyHeight}px;`")
    .collapsable-block-wrapper(ref="wrapperEl")
      slot
</template>

<script lang="ts">
export default defineComponent({
  name: "SLCollapsableBlock",
  components: {},
  props: {
    blockTitle: {
      type: String,
      default: "",
    },
    defaultCollapsed: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { defaultCollapsed } = toRefs(props);

    const wrapperEl = shallowRef<HTMLElement | null>(null);
    const isCollapsed = ref(defaultCollapsed.value);
    const bodyHeight = ref(0);

    function onToggleCollapse() {
      isCollapsed.value = !isCollapsed.value;
    }

    function checkImageLoaded() {
      nextTick(() => {
        if (!wrapperEl.value) return;

        const imageEls = wrapperEl.value.querySelectorAll("img");
        for (let i = 0; i < imageEls.length; i += 1) {
          const imageEl = imageEls[i] as HTMLImageElement;
          imageEl.onload = () => {
            getWrapperHeight();
          };
        }
      });
    }

    function getWrapperHeight() {
      nextTick(() => {
        if (isCollapsed.value || !wrapperEl.value) {
          bodyHeight.value = 0;
          return;
        }

        const wrapperElRect = wrapperEl.value.getBoundingClientRect();
        bodyHeight.value = wrapperElRect.height + 16;
      });
    }

    watch(isCollapsed, () => {
      getWrapperHeight();
    });

    onMounted(() => {
      getWrapperHeight();
      checkImageLoaded();
    });

    return {
      wrapperEl,
      isCollapsed,
      bodyHeight,
      onToggleCollapse,
    };
  },
});
</script>

<style lang="stylus">
.sl-collapsable-block
  @apply s('p-3.75') border border-secondary-new-300 rounded-lg

  &.collapsed
    .sl-collapsable-block-header
      .toggle-collapse-button
        .icon
          @apply rotate-0

    .sl-collapsable-block-body
      @apply pt-0

  &-header
    .toggle-collapse-button
      @apply inline-flex items-center space-x-2

      .button-title
        @apply text-sm text-primary

      .icon
        @apply text-xs leading-none text-primary-hover rotate-180 transition-transform

  &-body
    @apply relative pt-4 overflow-hidden transition-all

    .collapsable-block-wrapper
      @apply absolute top-4 left-0 w-full
</style>
