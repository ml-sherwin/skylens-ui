<template lang="pug">
.custom-select(:class='customSelectClass', ref='select')
  label.input-label(v-if='label', :for='uid') {{ label }}
  .form-control(
    :class='{ "is-invalid": isInvalid !== null && isInvalid, "is-valid": isInvalid !== null && !isInvalid }'
  )
    label.toggle-button(
      :for='uid',
      :class='{ selected: isSelected }',
      @click='onClickedToggle',
      ref='toggleButton'
    )
      span.button-title {{ buttonTitle }}
      SLIcon(icon='caret-down')
    .invalid-feedback
      slot(name='invalid-feedback') {{ invalidFeedback }}
  ClientOnly
    Teleport(to="body")
      .select-options(ref='optionList', :style="`min-width: ${popupMaxWidth}px`")
        .options-header(v-if='withSearch')
          SLSearchInput(
            v-model='search',
            placeholder='搜尋',
            :lazy='false',
            :isSearch='isSearch',
            @clear='onClearedSearch'
          )
        .options-wrapper.custom-scrollbar-y(ref='listWrapper')
          .option-list
            a.option-button(
              v-for='option in selectOptions',
              :key='option.label',
              href='javascript:;',
              :class='{ disabled: option.disabled, selected: isOptionSelected(option) }',
              @click.prevent='(e) => onClickedOption(e, option.value, option.disabled)'
            )
              SLIcon.icon-square(v-if='multiple', icon='square')
              SLIcon.icon-check-square(v-if='multiple', icon='check-square')
              span {{ option.label }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import isEqual from "lodash/isEqual";
import { fromEvent } from "rxjs";
import { createPopper } from "@popperjs/core";
import type { Placement } from "@popperjs/core";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getUID } from "~ui/utils";
import type IInputOption from "~ui/interface/IInputOption";

gsap.registerPlugin(ScrollToPlugin);

export default defineComponent({
  name: "SLSelect",
  components: {},
  props: {
    size: {
      type: String,
      default: "",
      validator: (val: string) => ["", "sm"].includes(val),
    },
    modelValue: {
      type: [Number, String, Object, Array] as PropType<any>,
      default: () => null,
    },
    label: {
      type: String,
      default: "",
    },
    options: {
      type: Array as PropType<Array<IInputOption>>,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "請選擇",
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    invalidFeedback: {
      type: String,
      default: "",
    },
    withSearch: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxSelection: {
      type: Number,
      default: 0,
    },
    minSelection: {
      type: Number,
      default: 0,
    },
    placement: {
      type: String,
      default: "bottom-start",
    },
    beReadonly: {
      type: Boolean,
      default: false,
    },
    lazyUpdate: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    "update:modelValue",
    "update:selecting",
    "search",
    "show:inputPopup",
    "hide:inputPopup",
  ],
  setup(props, { emit }) {
    const {
      modelValue,
      options,
      placeholder,
      disabled,
      multiple,
      maxSelection,
      minSelection,
      placement,
      inline,
      size,
      beReadonly,
      lazyUpdate,
    } = toRefs(props);

    const toggleButton = shallowRef<HTMLElement | null>(null);
    const optionList = shallowRef<HTMLElement | null>(null);
    const listWrapper = shallowRef<HTMLElement | null>(null);
    const select = shallowRef<HTMLElement | null>(null);
    const uid = ref<string | undefined>(undefined);
    const modelProxy = ref(
      Array.isArray(modelValue.value) ? [...modelValue.value] : modelValue.value
    );
    const search = ref("");
    const isSelecting = ref(false);
    const popupMaxWidth = ref(200);

    let clickSubscriber: any = null;
    let popperInstance: any = null;

    const customSelectClass = computed(() => {
      const classes: Array<Object | string> = [
        {
          inline: inline.value,
          disabled: disabled.value,
          readonly: beReadonly.value,
        },
      ];

      if (size.value !== "") {
        classes.push(`custom-select-${size.value}`);
      }

      return classes;
    });
    const selectOptions = computed(() => {
      if (placeholder.value === "" || multiple.value) {
        return options.value;
      }

      return [
        { label: placeholder.value, value: null, disabled: false },
        ...options.value,
      ];
    });
    const selectedOption = computed(() => {
      const selectedOption = selectOptions.value.find((option) => {
        return isEqual(option.value, modelValue.value);
      });

      return selectedOption;
    });
    const buttonTitle = computed(() => {
      if (multiple.value) {
        return placeholder.value;
      }

      return selectedOption.value?.label || placeholder.value;
    });
    const isSearch = computed(() => {
      return search.value !== "";
    });
    const isSelected = computed(() => {
      if (
        multiple.value &&
        Array.isArray(modelProxy.value) &&
        modelProxy.value.length > 0
      ) {
        return true;
      } else if (!multiple.value) {
        return (
          (placeholder.value !== "" &&
            !!selectedOption.value &&
            modelProxy.value) ||
          (placeholder.value === "" && !!selectedOption.value)
        );
      }

      return false;
    });

    function subscribeClick() {
      clickSubscriber = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (select.value && !select.value.contains(target as HTMLElement)) {
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

    function refreshScroll() {
      nextTick(() => {
        gsap.to(listWrapper.value, { duration: 0.5, scrollTo: 0 });
      });
    }

    function show() {
      isSelecting.value = true;

      const body = document.querySelector("body");
      if (body) {
        body.classList.add("popup");
      }

      popupMaxWidth.value = select.value?.getBoundingClientRect().width || 200;
      emit("show:inputPopup");
      subscribeClick();
      if (optionList.value) {
        optionList.value.setAttribute("data-show", "");
      }
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
      refreshScroll();
    }

    function hide() {
      const body = document.querySelector("body");
      if (body) {
        body.classList.remove("popup");
      }

      if (
        optionList.value &&
        optionList.value.getAttribute("data-show") === null
      )
        return;

      emit("hide:inputPopup");
      unsubscribeClick();
      if (optionList.value) {
        optionList.value.removeAttribute("data-show");
      }

      if (popperInstance) {
        popperInstance.setOptions({
          modifiers: [{ name: "eventListeners", enabled: false }],
        });
      }

      if (multiple.value && lazyUpdate.value) {
        emit("update:modelValue", modelProxy.value);
      }

      setupModelProxy();
      isSelecting.value = false;
    }

    function onClickedToggle() {
      if (disabled.value || beReadonly.value) return;

      if (
        !optionList.value ||
        optionList.value.getAttribute("data-show") !== null
      ) {
        hide();
        return;
      }

      show();
    }

    function onClickedOption(_: Event, newValue: any, disabled?: boolean) {
      if (disabled) {
        return;
      }

      if (!multiple.value) {
        emit("update:modelValue", newValue);
        hide();
        return;
      }

      if (Array.isArray(modelProxy.value)) {
        if (modelProxy.value.includes(newValue)) {
          if (
            minSelection.value > 0 &&
            modelProxy.value.length <= minSelection.value
          )
            return;
          modelProxy.value = modelProxy.value.filter(
            (v: any) => v !== newValue
          );
        } else {
          if (
            maxSelection.value > 0 &&
            modelProxy.value.length >= maxSelection.value
          )
            return;
          modelProxy.value.push(newValue);
        }
      }

      if (!lazyUpdate.value) {
        emit("update:modelValue", modelProxy.value);
      }
    }

    function onClearedSearch() {
      search.value = "";
    }

    function onFocusedSelect() {
      show();
    }

    function isOptionSelected(option: any) {
      if (multiple.value && Array.isArray(modelProxy.value)) {
        return !!modelProxy.value.find((v: any) => isEqual(v, option.value));
      } else if (!multiple.value) {
        return option.value === modelProxy.value;
      }

      return false;
    }

    function setupModelProxy() {
      if (Array.isArray(modelValue.value)) {
        modelProxy.value = [...modelValue.value];
        return;
      }

      modelProxy.value = modelValue.value;
    }

    watch(modelValue, () => {
      setupModelProxy();
    });
    watch(selectOptions, () => {
      refreshScroll();
    });
    watch(isSelecting, () => {
      emit("update:selecting", isSelecting.value);
    });
    watch(search, () => {
      emit("search", search.value);
    });

    onMounted(() => {
      uid.value = getUID();

      nextTick(() => {
        if (toggleButton.value && optionList.value) {
          popperInstance = createPopper(toggleButton.value, optionList.value, {
            placement: placement.value as Placement,
            modifiers: [{ name: "eventListeners", enabled: false }],
          });
        }
      });
    });

    onBeforeUnmount(() => {
      const body = document.querySelector("body");
      if (body) {
        body.classList.remove("popup");
      }

      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;
    });

    return {
      toggleButton,
      optionList,
      listWrapper,
      select,
      uid,
      modelProxy,
      search,
      isSelecting,
      popupMaxWidth,
      customSelectClass,
      selectOptions,
      selectedOption,
      buttonTitle,
      isSearch,
      isSelected,
      onClickedToggle,
      onClickedOption,
      onClearedSearch,
      onFocusedSelect,
      isOptionSelected,
      hide,
    };
  },
});
</script>

<style lang="stylus" scoped>
.custom-select
  @apply relative

  &.inline
    @apply flex

    .input-label
      @apply flex-grow-0 flex-shrink-0 mb-0 mr-2 py-2 border-t border-b border-transparent

    .form-control
      @apply flex-grow

  &.custom-select-sm
    .form-control
      label
        @apply s("py-0.75") text-sm

    .select-options
      .option-list
        .option-button
          @apply py-1 text-sm

  &.disabled, &.readonly
    .form-control
      label
        @apply border-primary-light bg-bg text-gray-4 cursor-default

        .icon
          @apply text-gray-4

  .input-label
    @apply mb-2 text-base leading-normal text-gray-2

  .form-control
    @apply relative block overflow-hidden

    &.is-invalid
      .toggle-button
        @apply border-danger-hover

      .invalid-feedback
        @apply block

    select
      @apply absolute outline-none

    label
      @apply relative flex items-center s("p-1.75") bg-white border border-primary-light rounded text-base leading-normal text-gray-4 space-x-2 cursor-pointer

      &.selected
        @apply text-gray-2

      .button-title
        @apply flex-grow truncate

      .icon
        @apply flex-grow-0 flex-shrink-0 text-xs text-gray-2

  .invalid-feedback
    @apply hidden text-danger text-xs

.select-options
  @apply flex flex-col z-60 absolute invisible border border-primary-light rounded bg-white overflow-hidden pointer-events-none

  &[data-show]
    @apply visible pointer-events-auto

  .options-header
    @apply p-1

  .options-wrapper
    @apply relative w-full s("max-h-[11.6875rem]") rounded overflow-auto

  .option-list
    @apply flex flex-col

    .option-button
      @apply block s("min-w-[10.125rem]") s('p-1.75') bg-white text-base leading-normal text-gray-3 s("hover:bg-bg") s("hover:text-primary")

      &.selected
        @apply bg-bg text-primary

        .icon-square
          @apply hidden

        .icon-check-square
          @apply inline-block

      &.disabled
        @apply cursor-default s("hover:bg-white") s("hover:text-gray-3")

      .icon
        @apply mr-2

        &-check-square
          @apply hidden
</style>
