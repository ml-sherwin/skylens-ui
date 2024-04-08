<template lang="pug">
.textarea(:class="{ inline, disabled: disabled }")
  label(v-if="label" :for="uid")
    span {{ label }}
    .form-control-notice(v-if='notice || $slots.notice')
      slot(name='notice' v-if='$slots.notice')
      template(v-else) ({{ notice }})
  .form-control(
      :class="{ 'is-invalid': isInvalid !== null && isInvalid, 'is-valid': isInvalid !== null && !isInvalid }"
    )
    textarea(
        :id="uid"
        :rows="rows"
        v-model="modelProxy"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInputed"
      )
    .invalid-feedback
      slot(name="invalid-feedback") {{ invalidFeedback }}
</template>

<script lang="ts">
import { getUID } from "~ui/utils";

export default defineComponent({
  name: "SLTextArea",
  props: {
    label: {
      type: String,
      default: null,
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
    rows: {
      type: Number,
      default: 6,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    notice: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const uid = ref<string | undefined>(undefined);
    const modelProxy = ref(modelValue.value);

    function onInputed(e: Event) {
      const { target } = e;
      emit("update:modelValue", (target as HTMLInputElement).value);
    }

    watch(modelValue, () => {
      modelProxy.value = modelValue.value;
    });

    onMounted(() => {
      uid.value = getUID();
    });

    return {
      uid,
      modelProxy,
      onInputed,
    };
  },
});
</script>

<style lang="stylus">
.textarea
  &.inline
    @apply flex

    label
      @apply flex-grow-0 flex-shrink-0 mb-0 mr-2 py-2 border-t border-b border-transparent

    .form-control
      @apply flex-grow

  &.disabled
    textarea
      @apply border-primary-light bg-bg

  label
    @apply mb-2 text-base leading-normal text-gray-2

  .is-invalid
    textarea
      @apply border-danger-hover

    .invalid-feedback
      @apply block

  .form-control
    @apply relative

  textarea
    @apply block w-full p-2 border border-primary-light rounded bg-white text-base text-gray-2 resize-none s('focus:border-primary') s('focus:outline-none')

  textarea:focus + .textarea-placeholder
    @apply invisible

  .form-control-notice
    @apply inline-block ml-1 text-gray-3 text-xs

  .invalid-feedback
    @apply hidden text-danger text-xs
</style>
