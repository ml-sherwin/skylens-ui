<template lang="pug">
.collapsable-multi-pill-select
  a(
      href="javascript:;"
      :class="{ active: showIndustryTypes }"
      @click="onClickedToggleIndustryTypes"
    ).toggle-button
    span 篩選產業類別
    SLIcon(icon="caret-down").toggle-icon
  .pills
    SLPillCheckbox(
        v-for="option in filteredOptions"
        :modelValue="modelValue"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
        color="primary"
        icon="times"
        @update:modelValue="onInputed"
        :key="option.value"
      )
</template>

<script lang="ts">
import type { PropType } from "vue";
import type IInputOption from "~ui/interface/IInputOption";

export default defineComponent({
  name: "SLCollapsableMultiPillSelect",
  components: {},
  props: {
    options: {
      type: Array as PropType<Array<IInputOption>>,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { options, modelValue } = toRefs(props);

    const showIndustryTypes = ref(false);

    const filteredOptions = computed(() => {
      if (!showIndustryTypes.value) {
        return options.value.filter((option) =>
          modelValue.value.includes(option.value)
        );
      }

      return options.value;
    });

    function onClickedToggleIndustryTypes() {
      showIndustryTypes.value = !showIndustryTypes.value;
    }

    function onInputed(newValue: any) {
      emit("update:modelValue", newValue);
    }

    return {
      showIndustryTypes,
      filteredOptions,
      onClickedToggleIndustryTypes,
      onInputed,
    };
  },
});
</script>

<style lang="stylus">
.collapsable-multi-pill-select
  .toggle-button
    @apply inline-flex items-center justify-between w-80 p-2 mb-2 border border-primary-light rounded text-base text-gray-2

    &.active
      .toggle-icon
        @apply rotate-180

    .toggle-icon
      @apply transform origin-center

  .pills
    @apply s('-mx-1') mb-4 border-b border-primary-lighter

    .pill-checkbox
      @apply mx-1 mb-2
</style>
