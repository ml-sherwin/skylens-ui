<template lang="pug">
.two-layer-multi-select(:class="[sizeClass, { bordered: withBorder }]" ref="selectEl")
  a(
    href="javascript:;"
    :class="{ selected: modelValue.length > 0 }"
    @click="onClickedToggle"
    ref="toggleEl"
    data-cy="project-button-toggle"
  ).toggle-button
    span.button-title {{ placeholder }}
    SLIcon(icon="caret-down")
  .select-menu-popup(ref="popupEl")
    .select-header
      SLSearchInput(
        v-model='query',
        :placeholder='searchPlaceholder',
        :lazy='500',
        :isSearch='query !== ""',
        @clear="onClearQuery"
      )
    .select-body
      .menu.menu-1
        .menu-header {{ firstOptionTitle }}
        .menu-body.custom-scrollbar-y
          .list
            .item(
              v-for='option in firstOptions',
              :class='{ selected: selectedFirstOption === option.key, checked: option.isCheckAll || option.isCheckSome }',
              :key='option.key',
            )
              SLCheckbox(
                label=""
                size="sm"
                :modelValue='option.isCheckAll'
                :isCheckSome="option.isCheckSome"
                @update:modelValue='(checked) => onInputedFirstOption(option.key, checked)'
              )
              a.item-name(
                href="javascript:;"
                @click="onClickedFirstOption(option.key)"
              ) {{ option.name }}
      .select-body-divider
      .menu.menu-2
        .menu-header {{ secondOptionTitle }}
        .menu-body.custom-scrollbar-y
          .list
            .item(
              v-for='option in secondOptions',
              :class="{ checked: modelValue.includes(option.key) }"
              :key='option.key',
            )
              SLCheckbox(
                size="sm"
                :label="option.name"
                :value="option.key"
                :modelValue="modelValue"
                @update:modelValue='onInputedSecondOption'
              )
</template>

<script lang="ts">
import type { PropType } from "vue";
import { fromEvent } from "rxjs";
import { createPopper } from "@popperjs/core";
import type { Placement } from "@popperjs/core";

export default defineComponent({
  name: "SLTwoLayerMultiSelect",
  components: {},
  props: {
    size: {
      type: String,
      default: "",
      validator: (val: string) => ["sm", ""].includes(val),
    },
    withBorder: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    searchPlaceholder: {
      type: String,
      default: "",
    },
    placement: {
      type: String as PropType<Placement>,
      default: "bottom-start",
    },
    firstOptionTitle: {
      type: String,
      default: "",
    },
    secondOptionTitle: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    options: {
      type: Array as PropType<
        {
          key: string;
          name: string;
          subOptions: { key: string; name: string }[];
        }[]
      >,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "update:selecting"],
  setup(props, { emit }) {
    const { size, modelValue, options, placement } = toRefs(props);

    const selectEl = shallowRef<HTMLElement | null>(null);
    const toggleEl = shallowRef<HTMLElement | null>(null);
    const popupEl = shallowRef<HTMLElement | null>(null);
    const query = ref("");
    const selectedFirstOption = ref<string | null>(null);
    const isSelecting = ref(false);

    let popperInstance: any = null;
    let clickSubscriber: any = null;

    const sizeClass = computed(() => {
      if (size.value === "") return "";
      return `two-layer-multi-select-${size.value}`;
    });
    const filteredOptions = computed(() => {
      if (query.value === "") {
        return options.value;
      }

      const regexp = new RegExp(`.*${query.value}.*`, "i");
      return options.value
        .map((option) => ({
          ...option,
          subOptions: option.subOptions.filter((o) => regexp.test(o.name)),
        }))
        .filter((option) => option.subOptions.length > 0);
    });
    const firstOptions = computed(() => {
      return options.value
        .map((option) => {
          let count = 0;

          option.subOptions.forEach((o) => {
            if (modelValue.value.includes(o.key)) {
              count += 1;
            }
          });

          return {
            ...option,
            isCheckAll: count === option.subOptions.length,
            isCheckSome: count > 0 && count < option.subOptions.length,
          };
        })
        .filter((option) => {
          const found = filteredOptions.value.find((o) => o.key === option.key);
          return !!found;
        });
    });
    const secondOptions = computed(() => {
      const found = filteredOptions.value.find(
        (option) =>
          selectedFirstOption.value && option.key === selectedFirstOption.value
      );
      return found?.subOptions || [];
    });

    function onClickedFirstOption(key: string) {
      selectedFirstOption.value = key;
    }

    function onInputedFirstOption(key: string, checked: boolean) {
      const checkedOptionSet = new Set([...modelValue.value]);
      const foundOption = options.value.find((o) => o.key === key);

      if (checked) {
        (foundOption?.subOptions || []).forEach((o) => {
          checkedOptionSet.add(o.key);
        });
      } else {
        (foundOption?.subOptions || []).forEach((o) => {
          checkedOptionSet.delete(o.key);
        });
      }

      selectedFirstOption.value = key;

      emit("update:modelValue", Array.from(checkedOptionSet.values()));
    }

    function onInputedSecondOption(newValue: string[]) {
      emit("update:modelValue", newValue);
    }

    function onClearQuery() {
      query.value = "";
    }

    function subscribeClick() {
      clickSubscriber = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (selectEl.value && !selectEl.value.contains(target as HTMLElement)) {
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

      isSelecting.value = true;

      const body = document.querySelector("body");
      if (body) {
        body.classList.add("popup");
      }

      if (popupEl.value) {
        popupEl.value.setAttribute("data-show", "");
      }
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
      const body = document.querySelector("body");
      if (body) {
        body.classList.remove("popup");
      }

      if (!popupEl.value || popupEl.value.getAttribute("data-show") === null)
        return;

      isSelecting.value = false;

      unsubscribeClick();

      if (popupEl.value) {
        popupEl.value.removeAttribute("data-show");
      }
      popperInstance.setOptions({
        modifiers: [{ name: "eventListeners", enabled: false }],
      });

      query.value = "";
    }

    function onClickedToggle() {
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
      if (!popupEl.value) return;

      if (selectEl.value && popupEl.value) {
        popperInstance = createPopper(selectEl.value, popupEl.value, {
          placement: placement.value as Placement,
          modifiers: [{ name: "eventListeners", enabled: false }],
        });
      }
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
      selectEl,
      toggleEl,
      popupEl,
      query,
      sizeClass,
      selectedFirstOption,
      firstOptions,
      secondOptions,
      onClickedFirstOption,
      onInputedFirstOption,
      onInputedSecondOption,
      onClearQuery,
      onClickedToggle,
    };
  },
});
</script>

<style lang="stylus">
.two-layer-multi-select
  @apply relative w-full

  &.two-layer-multi-select-sm
    .toggle-button
      @apply text-sm

  &.bordered
    .select-menu-popup
      @apply border-primary-light

  .toggle-button
    @apply relative flex items-center w-full s('p-1.75') s('space-x-1.75') border border-primary-light rounded text-base text-gray-4

    &.selected
      @apply text-gray-2

    .button-title
      @apply flex-grow

    .icon
      @apply flex-grow-0 flex-shrink-0 inline-flex text-xs text-gray-2 leading-none

  .select-menu-popup
    @apply z-10 flex flex-col s("h-67.75") s('min-w-[552px]') w-full s("pt-2.75") s("px-2.75") bg-white border border-bg rounded shadow invisible pointer-events-none

    &[data-show]
      @apply visible pointer-events-auto

    .select-header
      @apply flex-grow-0 flex-shrink-0 mb-3

      .search-input
        .button-group
          @apply s('py-0.75')

      .text-input
        .input-group
          .input
            @apply s('py-1.25')

            input
              @apply text-sm

    .select-body
      @apply flex-grow flex overflow-hidden

      .menu
        @apply flex-grow flex flex-col text-base leading-normal overflow-hidden
        flex 1

        &:hover
          flex 1.5

        &-2
          .menu-body
            .list
              .item
                .checkbox
                  @apply flex-grow

        &-header
          @apply flex-grow-0 flex-shrink-0 w-full pb-2 text-primary border-b border-primary

        &-body
          @apply relative flex-grow

          .list
            .item
              @apply relative flex items-center justify-start flex-nowrap s('py-1.5') px-2 s('space-x-2.5') text-sm text-gray-3
              @apply s('hover:bg-bg')

              &.checked
                @apply text-primary

                .checkbox
                  input:checked + label
                    span
                      @apply text-primary

              &.selected
                @apply bg-bg

              .checkbox
                @apply flex-grow-0 flex-shrink-0 inline-flex

                label
                  @apply flex-grow flex-nowrap flex items-center

                  .icon
                    @apply flex-grow-0 flex-shrink-0

                  span
                    @apply flex-grow block truncate

              &-name
                @apply flex-grow block truncate

      &-divider
        @apply flex-grow-0 flex-shrink-0 w-px h-auto mb-3 s("mr-2.75") ml-3 bg-gray-4
</style>
