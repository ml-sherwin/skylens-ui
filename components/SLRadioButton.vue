<template lang="pug">
.radio-button
  input(
      type="radio"
      :id="uid"
      :checked="isEqual(value, modelValue)"
      :value="value"
      :disabled="disabled"
      @change="onChanged"
    )
  label(:for="uid")
    SLIcon(icon="circle")
    SLIcon(icon="dot-circle")
    span(v-if="label !== ''") {{ label }}
</template>

<script lang="ts">
import isEqual from "lodash/isEqual";
import { getUID } from "~ui/utils";

export default defineComponent({
  name: "SLRadioButton",
  components: {},
  props: {
    modelValue: {
      type: [Number, String, Boolean, Object],
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: [Number, String, Boolean, Object],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { value } = toRefs(props);
    const uid = ref<string | undefined>(undefined);

    function onChanged() {
      emit("update:modelValue", value.value);
    }

    onMounted(() => {
      uid.value = getUID();
    });

    return {
      uid,
      isEqual,
      onChanged,
    };
  },
});
</script>

<style lang="stylus">
.radio-button
  @apply inline-block relative text-base overflow-hidden

  input
    @apply absolute s('-top-10') s('-left-10')

  label
    @apply relative inline-flex items-center text-base s('leading-4.5') text-gray-3 cursor-pointer

    .icon
      @apply hidden

    span
      @apply ml-1 text-base text-gray-2

  input:not(:checked) + label
    .icon-circle
      @apply inline-block text-primary

  input:checked + label
    .icon-dot-circle
      @apply inline-block text-primary

  input:disabled + label
    span
      @apply text-gray-3

    .icon-circle
      @apply text-gray-3

    .icon-dot-circle
      @apply text-gray-3
</style>
