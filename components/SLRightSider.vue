<template lang="pug">
.right-sider(:class="{ show: isShow, hover: isHover }" ref="el")
  transition(name="fade")
    .right-sider-modal(
      v-if="isShow"
      @click.prevent="onClickedModal"
    )
  .right-sider-content(:style="`margin-left: -${contentMarginLeft}px; min-height: ${contentMinHeight > 0 ? `${contentMinHeight}px` : 0}`" ref="contentEl")
    SLLink.sider-toggle(
      v-if="icon !== ''"
      :class="`${toggleColor !== '' ? `sider-toggle-${toggleColor}` : ''}`"
      :style="`margin-top: ${78 + order * (44 + 4)}px`"
      :title="toggleTitle"
      @mouseenter="onMouseEnteredToggle"
      @mouseleave="onMouseLeavedToggle"
      @click="toggleSider"
    )
      SLIcon(v-if="icon !== ''" :icon='icon')
    .right-sider-content-wrapper
      slot
    a.sider-close-button(href="javascript:;" @click="toggleSider")
      SLIcon(icon="times")
  .right-sider-addition-content(
    v-show='isShowAdditionContent',
    :style='`margin-right: ${contentMarginLeft + 4}px;`',
    ref='additionContentEl'
  )
    slot(name='addition-content')
</template>

<script lang="ts">
import { fromEvent, interval, Subscription } from "rxjs";
import { debounce, startWith } from "rxjs/operators";

export default defineComponent({
  name: "SLRightSider",
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    isShowAdditionContent: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    toggleColor: {
      type: String,
      default: "",
    },
    toggleTitle: {
      type: String,
      default: "",
    },
    contentMinHeight: {
      type: Number,
      default: 437,
    },
    closeOnBackdrop: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:isShow"],
  setup(props, { emit }) {
    const { isShow, isShowAdditionContent, closeOnBackdrop } = toRefs(props);

    const el = shallowRef<HTMLElement | null>(null);
    const contentEl = shallowRef<HTMLElement | null>(null);
    const additionContentEl = shallowRef<HTMLElement | null>(null);
    const order = ref(-1);
    const contentMarginLeft = ref(0);
    const isHover = ref(false);

    let observer: MutationObserver | null = null;
    let resizeSubscriber: Subscription | null = null;

    function toggleSider() {
      emit("update:isShow", !isShow.value);
    }

    function caculateCotentMarginLeft() {
      nextTick(() => {
        if (contentEl.value && isShow.value) {
          const contentElRect = contentEl.value.getBoundingClientRect();
          let marginLeft = contentElRect.width;

          if (isShowAdditionContent.value && additionContentEl.value) {
            const additionContentElRect =
              additionContentEl.value.getBoundingClientRect();

            const siderFullWidth =
              contentElRect.width + 4 + additionContentElRect.width + 12;

            if (siderFullWidth > window.innerWidth) {
              marginLeft -= siderFullWidth - window.innerWidth;
            }
          }

          contentMarginLeft.value = marginLeft;
          return;
        }

        contentMarginLeft.value = 0;
      });
    }

    function updateOrder() {
      nextTick(() => {
        const rightSideEl = document.querySelector("#right-side");
        if (!rightSideEl || !el.value) return;

        const rightSiders = rightSideEl.children;
        let newOrder = -1;
        for (let i = 0; i < rightSiders.length; i += 1) {
          if (rightSiders[i] === el.value) {
            newOrder = i;
          }
        }

        order.value = newOrder;
      });
    }

    function onMouseEnteredToggle() {
      isHover.value = true;
    }

    function onMouseLeavedToggle() {
      isHover.value = false;
    }

    function subscribeResize() {
      resizeSubscriber = fromEvent(window, "resize")
        .pipe(debounce(() => interval(500)))
        .pipe(startWith(0))
        .subscribe(() => {
          caculateCotentMarginLeft();
        });
    }

    function unsubscribeResize() {
      if (resizeSubscriber) {
        resizeSubscriber.unsubscribe();
      }
      resizeSubscriber = null;
    }

    function onClickedModal() {
      if (!closeOnBackdrop.value) return;

      emit("update:isShow", false);
    }

    watch([isShow, isShowAdditionContent], () => {
      caculateCotentMarginLeft();
    });

    onMounted(() => {
      subscribeResize();

      const rightSideEl = document.querySelector("#right-side");
      if (rightSideEl) {
        observer = new MutationObserver(updateOrder);
        observer.observe(rightSideEl, {
          attributes: false,
          childList: true,
          subtree: false,
        });
      }
      updateOrder();
    });

    onBeforeUnmount(() => {
      unsubscribeResize();
      if (observer) {
        observer.disconnect();
      }
      observer = null;
    });

    return {
      el,
      contentEl,
      additionContentEl,
      order,
      contentMarginLeft,
      isHover,
      toggleSider,
      onMouseEnteredToggle,
      onMouseLeavedToggle,
      onClickedModal,
    };
  },
});
</script>

<style lang="stylus">
.right-sider
  @apply fixed top-0 right-0 h-full
  z-index 9

  &.show, &.hover
    @apply z-50

  &.show
    .right-sider-modal
      @apply block

  &-modal
    @apply fixed top-0 left-0 w-full h-full s('bg-backdrop/70') hidden

  &-content
    @apply absolute top-4 left-0 flex p-6 bg-white border-t border-l border-b border-border rounded-l-lg shadow-popup-lg transition-margin
    max-width calc(100vw - 16px)
    max-height calc(100% - theme('spacing.8'))

    .sider-toggle
      @apply absolute top-0 left-0 inline-flex p-3 rounded-l-full text-lg text-white
      margin-top 78px
      margin-left -44px

      &-third
        @apply bg-third-hover

      &-purple
        @apply bg-edit-purple

    &-wrapper
      @apply flex max-w-full overflow-hidden

    .sider-close-button
      @apply absolute top-0 right-0 inline-flex mt-6 mr-6 text-base text-primary

  &-addition-content
    @apply absolute top-4 right-0 flex bg-white border border-border rounded-lg overflow-hidden shadow-popup-lg transition-margin
    max-height calc(100% - theme('spacing.8'))
</style>
