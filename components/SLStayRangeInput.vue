<template lang="pug">
.stay-range-input(
    :class="{ inline, disabled, readonly: beReadonly }"
  )
  label(v-if="label") {{ label }}
  .form-control(
      :class="{ 'is-invalid': isInvalid !== null && isInvalid, 'is-valid': isInvalid !== null && !isInvalid }"
      ref="toggle"
    )
    .form-control-container
      .input-group
        input(
          type='text'
          :value='stayStart'
          placeholder='1'
          maxlength='3'
          :disabled='disabled'
          @input='onInputedStayStart'
        )
        SLSelect(
          :modelValue='stayStartLevel'
          :options='stayLevelOptions'
          placeholder=''
          :disabled='disabled'
          :beReadonly='beReadonly'
          :isInvalid='isInvalid'
          ref='startSelectComp'
          @update:modelValue='onInputedStayStartLevel'
        )
      .input-group-splitter
      .input-group
        input(
          type='text'
          :value='stayEnd'
          placeholder='24'
          maxlength='3'
          :disabled='disabled'
          @input='onInputedStayEnd'
        )
        SLSelect(
          :modelValue='stayEndLevel'
          :options='stayLevelOptions'
          placeholder=''
          :disabled='disabled'
          :beReadonly='beReadonly'
          :isInvalid='isInvalid'
          ref='endSelectComp'
          @update:modelValue='onInputedStayEndLevel'
        )
    .invalid-feedback
      slot(name="invalid-feedback") {{ invalidFeedback }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import { SLSelect } from "#components";
import type IStayRange from "~ui/interface/IStayRange";
import { StayRangeLevel } from "~ui/interface/IStayRange";

type SLSelectType = InstanceType<typeof SLSelect>;

export default defineComponent({
  name: "SLStayRangeInput",
  components: {},
  props: {
    label: {
      type: String,
      default: undefined,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object as PropType<IStayRange | null>,
      default: null,
    },
    step: {
      type: Number,
      default: 1,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    invalidFeedback: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    beReadonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const toggle = shallowRef<HTMLElement | null>(null);
    const startSelectComp = shallowRef<SLSelectType | null>(null);
    const endSelectComp = shallowRef<SLSelectType | null>(null);

    const stayLevelOptions = computed(() => [
      { label: "分鐘", value: "minutes" },
      { label: "小時", value: "hours" },
    ]);
    const stayStart = computed(() => {
      if (
        !modelValue.value ||
        !modelValue.value.start ||
        modelValue.value.start.value === undefined ||
        modelValue.value.start.value === null
      ) {
        return "";
      }

      return modelValue.value.start.value;
    });
    const stayEnd = computed(() => {
      if (
        !modelValue.value ||
        !modelValue.value.end ||
        modelValue.value.end.value === undefined ||
        modelValue.value.end.value === null
      ) {
        return "";
      }

      return modelValue.value.end.value;
    });
    const stayStartLevel = computed(() => {
      return modelValue.value?.start?.level || "minutes";
    });
    const stayEndLevel = computed(() => {
      return modelValue.value?.end?.level || "hours";
    });

    function onInputedStayStart(e: Event) {
      const target = e.target as HTMLInputElement;
      let start = target.value === "" ? null : Number(target.value);

      if (
        start === null ||
        Number.isNaN(start) ||
        start < 1 ||
        (stayStartLevel.value === "hours" && start > 24)
      ) {
        start = null;
      }

      emit("update:modelValue", {
        start: {
          value: start,
          level: stayStartLevel.value,
        },
        end: {
          value: modelValue.value?.end?.value || null,
          level: stayEndLevel.value,
        },
      });
    }

    function onInputedStayEnd(e: Event) {
      const target = e.target as HTMLInputElement;
      let end = target.value === "" ? null : Number(target.value);

      if (
        end === null ||
        Number.isNaN(end) ||
        (stayEndLevel.value === "hours" && end > 24)
      ) {
        end = null;
      }

      emit("update:modelValue", {
        start: {
          value: modelValue.value?.start?.value || null,
          level: stayStartLevel.value,
        },
        end: {
          value: end,
          level: stayEndLevel.value,
        },
      });
    }

    function onInputedStayStartLevel(newLevel: StayRangeLevel) {
      let start = modelValue.value?.start?.value || null;

      if (newLevel === "hours" && start !== null && start > 24) {
        start = null;
      }

      emit("update:modelValue", {
        start: {
          value: start,
          level: newLevel,
        },
        end: {
          value: modelValue.value?.end?.value || null,
          level: stayEndLevel.value,
        },
      });
    }

    function onInputedStayEndLevel(newLevel: StayRangeLevel) {
      let end = modelValue.value?.end?.value || null;

      if (newLevel === "hours" && end !== null && end > 24) {
        end = null;
      }

      emit("update:modelValue", {
        start: {
          value: modelValue.value?.start?.value || null,
          level: stayStartLevel.value,
        },
        end: {
          value: end,
          level: newLevel,
        },
      });
    }

    function hide() {
      if (startSelectComp.value) {
        startSelectComp.value.hide();
      }

      if (endSelectComp.value) {
        endSelectComp.value.hide();
      }
    }

    return {
      toggle,
      startSelectComp,
      endSelectComp,
      stayLevelOptions,
      stayStart,
      stayEnd,
      stayStartLevel,
      stayEndLevel,
      onInputedStayStart,
      onInputedStayEnd,
      onInputedStayStartLevel,
      onInputedStayEndLevel,
      hide,
    };
  },
});
</script>

<style lang="stylus">
.stay-range-input
  @apply flex flex-col

  &.inline
    @apply flex flex-row

    & > label
      @apply flex-grow-0 flex-shrink-0 mb-0 mr-2 py-2 border-t border-b border-transparent

    .form-control
      @apply flex-grow

  &.disabled, &.readonly
    .input-group
      input[type=text]
        @apply border-primary-light bg-bg


  & > label
    @apply mb-2 text-base leading-normal text-gray-2

  .is-invalid
    .input-group
      input[type=text]
        @apply border-danger

    .invalid-feedback
      @apply block


  .form-control-container
    @apply flex items-center space-x-2

  .input-group
    @apply flex-grow flex flex-nowrap space-x-2

    input[type=text]
      @apply flex-grow-0 flex-shrink-0 w-11 border border-primary-light rounded text-base text-center text-gray-2 outline-none

    .custom-select
      @apply w-full

  .input-group-splitter
    @apply flex-grow-0 flex-shrink-0 w-3 h-px bg-primary

  .invalid-feedback
    @apply hidden text-danger text-xs
</style>
