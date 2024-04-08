<template lang="pug">
.text-input(:class="textInputClass")
  label(v-if="label || $slots.label" :for="uid")
    slot(name='label') {{ label }}
    span.required(v-if="required")  *
  .form-control(
      :class="{ 'is-invalid': isInvalid !== null && isInvalid, 'is-valid': isInvalid !== null && !isInvalid }"
    )
    .input-group(
        :class="{ 'is-focus': isFocus, 'is-fill': modelValue !== '' }"
      )
      .input-group-prepend(v-if="$slots.prepend")
        slot(name="prepend")
      .input(:class="inputClass")
        input(
            :name="name === '' ? uid : name"
            :type="type"
            :id="uid"
            :value="modelValue"
            :disabled="disabled"
            :readonly="beReadonly"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            @compositionstart="onInputCompositionStart"
            @compositionend="onInputCompositionEnd"
            @input="onInputedModelValue"
            @focus="onFocused"
            @blur="onBlured"
            @paste="onPasted"
            ref='input'
            :data-cy="name === '' ? uid : name"
          )
        label(v-if="label || $slots.label" :for="uid").float-label
          slot(name='label') {{ label }}
        SLIcon(icon="exclamation-triangle")
      .input-group-append(v-if="$slots.append")
        slot(name="append")
    .invalid-feedback
      slot(name="invalid-feedback") {{ invalidFeedback }}
</template>

<script lang="ts">
import debounce from "lodash/debounce";
import { getUID } from "~ui/utils";

export default defineComponent({
  name: "SLTextInput",
  components: {},
  props: {
    type: {
      type: String,
      default: "text",
      validator: (val: string) => ["", "text", "password"].includes(val),
    },
    name: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
      validator: (val: string) => ["", "sm", "xs"].includes(val),
    },
    label: {
      type: String,
      default: undefined,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    invalidFeedback: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: undefined,
    },
    lazy: {
      type: [Boolean, Number],
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: "new-password",
    },
    beReadonly: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "update:modelValue",
    "lazyUpdate:modelValue",
    "focus",
    "blur",
    "paste",
  ],
  setup(props, { emit }) {
    const { modelValue, size, lazy, inline, variant, disabled, beReadonly } =
      toRefs(props);

    const input = shallowRef<HTMLInputElement | null>(null);
    const uid = ref<string | undefined>(undefined);
    const isFocus = ref(false);
    const isComposing = ref(false);

    const textInputClass = computed(() => {
      const textInputClass: string[] = [];

      if (inline.value) textInputClass.push("inline");
      if (variant.value === "float") textInputClass.push("is-float");
      if (disabled.value) textInputClass.push("disabled");
      if (beReadonly.value) textInputClass.push("readonly");

      return textInputClass;
    });
    const inputClass = computed(() => {
      if (size.value === "") {
        return "";
      }

      return `input-${size.value}`;
    });

    const debounceUpdateModelValue = debounce(
      lazyUpdateModelValue,
      Number.isInteger(lazy.value) ? (lazy.value as number) : 500
    );

    function onFocused() {
      isFocus.value = true;
      emit("focus");
    }

    function onBlured() {
      isFocus.value = false;
      emit("blur");
    }

    function onPasted(e: ClipboardEvent) {
      emit("paste", e);
    }

    function lazyUpdateModelValue(newValue: string) {
      emit("lazyUpdate:modelValue", newValue);
    }

    function onInputCompositionStart() {
      isComposing.value = true;
    }

    function onInputCompositionEnd(e: InputEvent) {
      const target = e.target as HTMLInputElement;
      if (target) {
        if (Number.isInteger(lazy.value) || lazy.value) {
          debounceUpdateModelValue(target.value);
        }

        emit("update:modelValue", target.value);
      }
    }

    function onInputedModelValue(e: InputEvent) {
      if (isComposing.value && !e.isComposing) {
        isComposing.value = false;
        return;
      }

      const target = e.target as HTMLInputElement;

      if (target) {
        if (Number.isInteger(lazy.value) || lazy.value) {
          debounceUpdateModelValue(target?.value || "");
        }

        emit("update:modelValue", target?.value || "");
      }
    }

    function focus() {
      if (!input.value) return;
      input.value.focus();
    }

    onMounted(() => {
      uid.value = getUID();
    });

    return {
      input,
      uid,
      isFocus,
      textInputClass,
      inputClass,
      onFocused,
      onBlured,
      onPasted,
      onInputCompositionStart,
      onInputCompositionEnd,
      onInputedModelValue,
      focus,
    };
  },
});
</script>

<style lang="stylus">
.text-input
  &.inline
    @apply flex

    & > label
      @apply flex-grow-0 flex-shrink-0 mb-0 mr-2 py-2 border-t border-b border-transparent

    .form-control
      @apply flex-grow

  &.is-float
    & > label
      @apply hidden

    .input-group
      &.is-fill
        .input
          @apply bg-white border-primary-lighter

      &.is-focus
        .input
          @apply bg-white border-primary

      .input
        @apply relative bg-bg-middle border-bg-middle

        .float-label
          @apply inline-block

    .is-invalid
      .input-group
        .input, .input.is-focus
          @apply border-danger-hover

  &.is-fixed-float
    & > label
      @apply hidden

    .input-group
      .input
        @apply relative bg-white border-primary

        .float-label
          @apply inline-block s('ml-1.5') s('-mt-2.25') py-0 s('px-0.5') bg-white text-primary text-xs transition-input-focus

    .is-invalid
      .input-group
        .input, .input.is-focus
          @apply border-danger-hover

  &.disabled, &.readonly
    .input-group
      &.is-focus
        .input
          @apply border-primary-light

      .input
        @apply border-primary-light bg-bg

  & > label
    @apply mb-2 text-base leading-normal text-gray-2

    .required
      @apply text-danger

  .is-invalid
    .input-group, .input-group.is-focus
      .input
        @apply border-danger-hover

        &.input-sm, &.input-xs
          .icon
            @apply hidden

        .icon
          @apply inline-block

    .invalid-feedback
      @apply block


  .input-group
    @apply flex flex-nowrap text-base leading-normal

    &.is-focus
      .input
        @apply border-primary

    &.is-fill, &.is-focus
      .input
        .float-label
          @apply s('ml-1.5') s('-mt-2.25') py-0 s('px-0.5') bg-white text-primary text-xs transition-input-focus

    &-prepend
      @apply flex-grow-0 flex-shrink-0

    .input
      @apply flex-grow flex items-center s('p-1.75') bg-white rounded border border-primary-light

      &.input-sm
        @apply s('py-0.75')

        input
          @apply text-base

      &.input-xs
        @apply py-px s('px-0.75')

        input
          @apply text-base

      &:not(:first-child)
        @apply rounded-l-none border-l-0

      &:not(:last-child)
        @apply rounded-r-none border-r-0

      input
        @apply flex-grow w-full bg-transparent text-gray-2 placeholder-gray-4 s('focus:outline-none')

      .icon
        @apply flex-grow-0 flex-shrink-0 hidden text-danger-hover

      .float-label
        @apply hidden absolute top-0 left-0 s('p-1.75') border-t border-b border-transparent text-gray-3 cursor-text

    &-append
      @apply flex-grow-0 flex-shrink-0

  .invalid-feedback
    @apply hidden text-danger text-xs
</style>
