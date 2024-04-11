<template lang="pug">
.custom-multi-select
  .options-wrapper.custom-scrollbar-y(ref='listWrapperEl')
    .options
      a.option-button(
        v-for='option in formatedOptions',
        href='javascript:;',
        :class='{ selected: option.selected }',
        @click='(e) => onClickedOption(e, option.value)'
      )
        span.option-label {{ option.label }}
        span.btn.btn-apply(v-if='!option.selected') {{ applyTitle }}
        span.btn.btn-cancel(v-else) {{ cancelTitle }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import { isEqual } from "lodash-es";
import type IInputOption from "~ui/interface/IInputOption";

export default defineComponent({
  name: "SLMultiSelect",
  components: {},
  props: {
    modelValue: {
      type: Array,
      default: null,
    },
    options: {
      type: Array as PropType<Array<IInputOption>>,
      default: () => [],
    },
    applyTitle: {
      type: String,
      default: "套用",
    },
    cancelTitle: {
      type: String,
      default: "取消",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue, options } = toRefs(props);

    const listWrapperEl = ref(null);
    const listScrollbarEl = ref(null);
    const modelProxy = ref(modelValue.value);

    const formatedOptions = computed(() => {
      return options.value.map((option) => {
        return {
          ...option,
          selected:
            modelValue.value.findIndex((v) => isEqual(v, option.value)) > -1,
        };
      });
    });

    function onClickedOption(_: Event, optionValue: any) {
      const found = modelValue.value.find((v) => isEqual(v, optionValue));
      if (found) {
        emit(
          "update:modelValue",
          modelValue.value.filter((v) => !isEqual(v, optionValue))
        );
        return;
      }

      emit("update:modelValue", [...modelValue.value, optionValue]);
    }

    watch(modelProxy, () => {
      emit("update:modelValue", modelProxy.value);
    });

    return {
      listWrapperEl,
      listScrollbarEl,
      modelProxy,
      formatedOptions,
      onClickedOption,
    };
  },
});
</script>

<style lang="stylus">
.custom-multi-select
  @apply px-3 py-1 border border-primary-light rounded

  .options-wrapper
    @apply relative overflow-auto

  .options
    @apply flex flex-col

    .option-button
      @apply flex justify-between items-center px-2 py-1 bg-white shadow-inline s("hover:bg-card-primary-light")

      &:hover
        .btn
          @apply opacity-100

      &.selected
        .option-label
          @apply text-primary font-bold

        .btn
          @apply bg-primary-hover opacity-100

        &:hover, &:active, &:focus
          .btn
            @apply bg-primary

      .option-label
        @apply flex-grow inline-block text-base leading-normal text-gray-2 truncate

      .btn
        @apply flex-grow-0 flex-shrink-0 inline-block px-2 py-1 bg-primary rounded text-base leading-normal text-white opacity-0
</style>
