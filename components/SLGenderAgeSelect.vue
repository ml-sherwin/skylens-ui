<template lang="pug">
.gender-age-select(ref="el")
  a.toggle-button(
    href="javascript:;"
    ref="toggleEl"
    @click="onToggleSelect"
  )
    .toggle-title {{ placeholder }}
    SLIcon(icon="caret-down")
  ClientOnly
    Teleport(to="body")
      .options-popup(ref="popupEl", :style="`min-width: ${maxPopupWidth}px`")
        .options-block.options-block-gender
          .options-block-header 性別
          .options-block-body
            .custom-scrollbar-y.max-h-full
              .options-list
                SLCheckbox(
                  v-for="option in genderOptions"
                  :label="option.label"
                  :value="option.value"
                  v-model="genderProxy"
                  :key="option.value"
                )
        .options-divide
        .options-block.options-block-age
          .options-block-header 年齡
          .options-block-body
            .custom-scrollbar-y.max-h-full
              .options-list
                SLCheckbox(
                  v-for="option in ageOptions"
                  :label="option.label"
                  :value="option.value"
                  v-model="ageProxy"
                  :key="option.value"
                )
</template>

<script lang="ts">
import type { PropType } from "vue";
import { fromEvent, Subscription } from "rxjs";
import { createPopper } from "@popperjs/core";
import type { Instance as PopperInstance } from "@popperjs/core";
import { AGE_RANGE_NAME } from "~ui/utils/constants";

export default defineComponent({
  name: "SLGenderAgeSelect",
  components: {},
  props: {
    placement: {
      type: String,
      default: "bottom-start",
    },
    modelValue: {
      type: Object as PropType<{ gender: string[]; age: number[] }>,
      default: null,
    },
  },
  emits: ["update:modelValue", "update:selecting"],
  setup(props, { emit }) {
    const { modelValue, placement } = toRefs(props);

    const el = shallowRef<HTMLElement | null>(null);
    const toggleEl = shallowRef<HTMLElement | null>(null);
    const popupEl = shallowRef<HTMLElement | null>(null);
    const isSelecting = ref(false);
    const maxPopupWidth = ref(200);

    let popperInstance: PopperInstance | null = null;
    let clickSubscriber: Subscription | null = null;

    const placeholder = computed(() => {
      if (
        !modelValue.value ||
        ((!modelValue.value.gender || modelValue.value.gender.length === 0) &&
          (!modelValue.value.age || modelValue.value.age.length === 0))
      )
        return "所有受眾";

      return "已篩選受眾";
    });
    const genderOptions = computed(() => [
      { label: "男性", value: "male" },
      { label: "女性", value: "female" },
    ]);
    const ageOptions = computed(() =>
      AGE_RANGE_NAME.map((name, i) => ({
        label: name,
        value: i + 1,
      }))
    );
    const genderProxy = computed({
      get: () => {
        return modelValue.value?.gender || [];
      },
      set: (newValue) => {
        emit("update:modelValue", {
          gender: newValue,
          age: modelValue.value?.age || [],
        });
      },
    });
    const ageProxy = computed({
      get: () => {
        return modelValue.value?.age || [];
      },
      set: (newValue) => {
        emit("update:modelValue", {
          gender: modelValue.value?.gender || [],
          age: newValue,
        });
      },
    });

    function subscribeClick() {
      clickSubscriber = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (
          el.value &&
          !el.value.contains(target as HTMLElement) &&
          popupEl.value &&
          !popupEl.value.contains(target as HTMLElement)
        ) {
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
      if (!popupEl.value || !popperInstance) return;

      if (popupEl.value) {
        popupEl.value.setAttribute("data-show", "");
      }

      maxPopupWidth.value =
        toggleEl.value?.getBoundingClientRect().width || 200;
      isSelecting.value = true;
      subscribeClick();
      popperInstance.setOptions({
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
          { name: "eventListeners", enabled: true },
        ],
      });
    }

    function hide() {
      if (
        !popupEl.value ||
        popupEl.value.getAttribute("data-show") === null ||
        !popperInstance
      )
        return;

      unsubscribeClick();

      if (popupEl.value) {
        popupEl.value.removeAttribute("data-show");
      }
      popperInstance.setOptions({
        modifiers: [{ name: "eventListeners", enabled: false }],
      });
      isSelecting.value = false;
    }

    function onToggleSelect() {
      if (!popupEl.value || popupEl.value.getAttribute("data-show") !== null) {
        hide();
        return;
      }

      show();
    }

    watch(isSelecting, () => {
      emit("update:selecting", isSelecting.value);
    });

    onMounted(() => {
      nextTick(() => {
        if (toggleEl.value && popupEl.value) {
          popperInstance = createPopper(toggleEl.value, popupEl.value, {
            placement: "bottom-end",
            strategy: "absolute",
            modifiers: [{ name: "eventListeners", enabled: false }],
          });
        }
      });
    });

    onBeforeUnmount(() => {
      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;

      if (clickSubscriber) {
        clickSubscriber.unsubscribe();
      }
      clickSubscriber = null;
    });

    return {
      el,
      toggleEl,
      popupEl,
      maxPopupWidth,
      placeholder,
      genderOptions,
      ageOptions,
      genderProxy,
      ageProxy,
      onToggleSelect,
    };
  },
});
</script>

<style lang="stylus">
.gender-age-select
  @apply relative inline-flex

  .toggle-button
    @apply inline-flex items-center justify-between w-full s('p-1.75') border border-primary-light rounded space-x-4 text-sm text-gray-2

    .toggle-title
      @apply flex-grow truncate

    .icon
      @apply flex-grow-0 flex-shrink-0 text-xs leading-none

.options-popup
  @apply z-60 absolute flex s('max-h-[196px]') s('p-2.75') bg-white border border-primary-light rounded shadow pointer-events-none invisible

  &[data-show]
    @apply pointer-events-auto visible

  .options-block
    @apply flex flex-col
    &-gender
      @apply flex-grow-0 flex-shrink-0
      width 37%

    &-age
      @apply flex-grow

    &-header
      @apply s('pb-1.75') border-b border-primary text-base text-primary

    &-body
      @apply overflow-hidden
      .options-list
        @apply flex flex-col

        .checkbox
          label
            @apply w-full s('py-1.5') px-2 text-sm
            @apply s('hover:bg-bg')

            span
              @apply ml-1

  .options-divide
    @apply flex-grow-0 flex-shrink-0 w-px ml-3 s('mr-2.75') bg-gray-4
</style>
