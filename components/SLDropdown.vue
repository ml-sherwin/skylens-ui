<template lang="pug">
.dropdown(:class="{ active: visible }" ref="buttonEl")
  a(
      href="javascript:;"
      @click="onClickedToggle"
      ref="toggleEl"
    ).dropdown-toggle
    span.toggle-title {{ title }}
    SLIcon(:icon="toggleIcon").toggle-icon
  Teleport(to='body')
    .dropdown-menu(:class='menuClass', ref="popupEl")
      .dropdown-search(v-if="withSearch")
        SLSearchInput(
            placeholder="搜尋"
            v-model="search"
          )
      .dropdown-list-wrapper.custom-scrollbar-y(:style='`min-width: ${listWidth}px`', ref="listWrapperEl")
        .dropdown-list(ref='dropdownListEl')
          slot
</template>

<script lang="ts">
import { fromEvent } from "rxjs";
import { createPopper } from "@popperjs/core";
import type { Placement } from "@popperjs/core";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default defineComponent({
  name: "SLDropdown",
  components: {},
  props: {
    showDropdown: {
      type: Boolean,
      default: false,
    },
    withSearch: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    placement: {
      type: String,
      default: "bottom-start",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    toggleIcon: {
      type: String,
      default: "caret-down",
    },
    menuClass: {
      type: [Object, Array, String] as PropType<
        { [key: string]: boolean } | string[] | string
      >,
      default: () => [],
    },
  },
  emits: ["update:showDropdown", "update:search"],
  setup(props, { emit }) {
    const { showDropdown, placement, disabled } = toRefs(props);

    const toggleEl = shallowRef<HTMLElement | null>(null);
    const popupEl = shallowRef<HTMLElement | null>(null);
    const listWrapperEl = shallowRef<HTMLElement | null>(null);
    const dropdownListEl = shallowRef<HTMLElement | null>(null);
    const buttonEl = shallowRef<HTMLElement | null>(null);
    const visible = ref(showDropdown.value);
    const search = ref("");
    const listWidth = ref(64);

    let popperInstance: any = null;
    let clickSubscriber: any = null;
    let observer: MutationObserver | null = null;

    function subscribeClick() {
      clickSubscriber = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (buttonEl.value && !buttonEl.value.contains(target as Node)) {
          hide();
        }
      });
    }

    function unsubscribeClick() {
      if (clickSubscriber) {
        clickSubscriber.unsubscribe();
      }
      clickSubscriber = null;
    }

    function show() {
      if (!popupEl.value) return;

      if (popupEl.value.getAttribute("data-show") === "") return;

      const body = document.querySelector("body");
      if (body) {
        body.classList.add("popup");
      }

      subscribeClick();
      popupEl.value.setAttribute("data-show", "");

      popperInstance.setOptions({
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
          { name: "eventListeners", enabled: true },
        ],
      });

      popperInstance.update();
      visible.value = true;
    }

    function hide() {
      const body = document.querySelector("body");
      if (body) {
        body.classList.remove("popup");
      }

      if (!popupEl.value || popupEl.value.getAttribute("data-show") === null)
        return;
      unsubscribeClick();
      popupEl.value.removeAttribute("data-show");
      popperInstance.setOptions({
        modifiers: [{ name: "eventListeners", enabled: false }],
      });
      visible.value = false;
    }

    function onClickedToggle() {
      if (disabled.value) return;

      if (!popupEl.value || popupEl.value.getAttribute("data-show") !== null) {
        hide();
        return;
      }
      show();
    }

    function refreshScroll() {
      if (listWrapperEl.value) {
        gsap.to(listWrapperEl.value, { duration: 0.5, scrollTo: 0 });
      }
    }

    function setupListWidth() {
      nextTick(() => {
        const lwidth = dropdownListEl.value?.getBoundingClientRect().width || 0;
        const toggleWidth = toggleEl.value?.getBoundingClientRect().width || 0;
        listWidth.value = Math.max(lwidth, toggleWidth);
      });
    }

    watch(showDropdown, () => {
      visible.value = showDropdown.value;
    });
    watch(
      visible,
      () => {
        if (visible.value) {
          show();
        } else {
          hide();
        }
        emit("update:showDropdown", visible.value);
      },
      { immediate: true }
    );
    watch(search, () => {
      emit("update:search", search.value);
    });

    onMounted(() => {
      if (toggleEl.value && popupEl.value) {
        popperInstance = createPopper(toggleEl.value, popupEl.value, {
          placement: placement.value as Placement,
          modifiers: [{ name: "eventListeners", enabled: false }],
        });
      }

      observer = new MutationObserver(() => {
        refreshScroll();
        setupListWidth();
      });

      if (dropdownListEl.value) {
        observer.observe(dropdownListEl.value, {
          attributes: false,
          childList: true,
          subtree: false,
        });
      }

      setupListWidth();
    });
    onBeforeUnmount(() => {
      const body = document.querySelector("body");
      if (body) {
        body.classList.remove("popup");
      }

      if (popperInstance) {
        popperInstance.destroy();
      }

      if (observer) {
        observer.disconnect();
      }

      popperInstance = null;
      observer = null;
    });

    return {
      toggleEl,
      popupEl,
      listWrapperEl,
      dropdownListEl,
      buttonEl,
      visible,
      search,
      listWidth,
      onClickedToggle,
    };
  },
});
</script>

<style lang="stylus">
.dropdown
  @apply inline-block relative

  &.active
    .dropdown-toggle

      .toggle-icon
        @apply text-primary-hover rotate-180

  &-toggle
    @apply flex items-center s('p-1.75') border border-primary-light rounded bg-white space-x-2 text-base text-gray-2 whitespace-nowrap

    .toggle-icon
      @apply text-xs leading-none text-gray-2 transition-transform transform

  &-menu
    @apply z-50 flex flex-col max-h-48 border border-primary-light rounded bg-white shadow-md overflow-hidden invisible pointer-events-none

    &[data-show]
      @apply visible pointer-events-auto

      .dropdown-list-wrapper
        .dropdown-list
          @apply relative

    .dropdown-search
      @apply flex-grow-0 flex-shrink-0 mb-1 p-1

    .dropdown-list-wrapper
      @apply flex-grow

      .dropdown-list
        @apply absolute
</style>
