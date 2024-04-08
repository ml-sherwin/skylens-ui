<template lang="pug">
.sort-by-dropdown(
  :class='{ single: options.length === 1 }',
  ref='el',
)
  a(href='javascript:;', ref='toggleEl', @click='onToggle').sort-by-dropdown-toggle
    span {{ selectedOption ? selectedOption.label : '' }}
    SLIcon(icon='caret-down')
  .sort-by-dropdown-menu(ref='menuEl')
    a.sort-by-dropdown-item(
      v-for='option in options',
      href='javascript:;',
      :class='{ active: option.value === modelValue }'
      :key='option.value',
      @click='onClickedItem(option.value)'
    ) {{ option.label }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import { createPopper } from "@popperjs/core";
import type { Instance as PopperInstance } from "@popperjs/core";
import { fromEvent, Subscription } from "rxjs";
import type IInputOption from "~ui/interface/IInputOption";

export default defineComponent({
  name: "SLSortByDropdown",
  components: {},
  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number>,
      required: true,
    },
    options: {
      type: Array as PropType<IInputOption[]>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue, options } = toRefs(props);

    const el = shallowRef<HTMLDivElement | null>(null);
    const toggleEl = shallowRef<HTMLLinkElement | null>(null);
    const menuEl = shallowRef<HTMLDivElement | null>(null);
    const isShowMenu = ref(false);

    let popperInstance: PopperInstance | null = null;
    let clickSubscriber: Subscription | null = null;

    const selectedOption = computed(() =>
      (options.value || []).find((o) => o.value === modelValue.value)
    );

    function onToggle() {
      isShowMenu.value = !isShowMenu.value;
    }

    function createPopperInstance() {
      destroyPopper();

      nextTick(() => {
        if (toggleEl.value && menuEl.value && options.value.length > 1) {
          popperInstance = createPopper(toggleEl.value, menuEl.value, {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 4],
                },
              },
              { name: "eventListeners", enabled: false },
            ],
          });
        }
      });
    }

    function destroyPopper() {
      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;
    }

    function destorySubscriber() {
      if (clickSubscriber) {
        clickSubscriber.unsubscribe();
      }
      clickSubscriber = null;
    }

    function show() {
      if (!menuEl.value || !popperInstance || options.value.length < 2) return;

      menuEl.value.setAttribute("data-show", "");
      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...(options.modifiers || []),
          { name: "eventListeners", enabled: true },
        ],
      }));
      popperInstance.update();

      destorySubscriber();
      clickSubscriber = fromEvent(window, "click").subscribe((e: Event) => {
        if (el.value && el.value.contains(e.target as Node)) {
          return;
        }

        isShowMenu.value = false;
      });
    }

    function hide() {
      if (!menuEl.value || !popperInstance) return;

      menuEl.value.removeAttribute("data-show");
      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...(options.modifiers || []),
          { name: "eventListeners", enabled: false },
        ],
      }));

      destorySubscriber();
    }

    function onClickedItem(optionValue: string | number) {
      emit("update:modelValue", optionValue);
      isShowMenu.value = false;
    }

    watch(isShowMenu, () => {
      if (isShowMenu.value) {
        show();
      } else {
        hide();
      }
    });

    onMounted(() => {
      createPopperInstance();
    });

    onBeforeUnmount(() => {
      destroyPopper();
    });

    return {
      el,
      toggleEl,
      menuEl,
      selectedOption,
      onToggle,
      onClickedItem,
    };
  },
});
</script>

<style lang="stylus" scoped>
.sort-by-dropdown
  @apply inline-flex

  &.single
    .sort-by-dropdown-toggle
      @apply bg-white cursor-default
      .icon
        @apply hidden

  &-toggle
    @apply inline-flex items-center px-1 s('py-0.5') space-x-2 bg-bg-middle rounded text-sm text-primary
    .icon
      @apply text-xs

  &-menu
    @apply s('z-[2]') flex-col s('min-w-[84px]') bg-white border border-primary-light rounded overflow-hidden hidden

    &[data-show]
      @apply inline-flex

    .sort-by-dropdown-item
      @apply inline-flex p-2 bg-white text-sm text-gray-3
      &.active
        @apply bg-bg text-primary
</style>
