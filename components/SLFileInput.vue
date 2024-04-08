<template lang="pug">
.custom-file-input
  .file-button(:class='{ uploaded: isUploaded }')
    input(
      :id='uid',
      type='file',
      :accept='accept',
      @change='onFileChanged'
      ref='input'
    )
    label(:for='uid') {{ uploadButtonTitle }}
  .filename(v-if='isUploaded && filename !== ""') {{ filename }}
</template>

<script lang="ts">
import { getUID } from "~ui/utils";

export default defineComponent({
  name: "SLFileInput",
  components: {},
  props: {
    accept: {
      type: String,
      default: ".jpg, .jpeg, .png, .gif",
    },
  },
  emits: ["update:modelValue"],
  setup(_, { emit }) {
    const input = shallowRef<HTMLInputElement | null>(null);
    const uid = ref<string | undefined>(undefined);
    const isUploaded = ref(false);
    const filename = ref("");

    const uploadButtonTitle = computed(() => {
      if (isUploaded.value) {
        return "重新上傳";
      }

      return "選擇檔案";
    });

    function onFileChanged(e: Event) {
      const { target } = e;
      const file = ((target as HTMLInputElement).files || [])[0];

      filename.value = file.name;
      isUploaded.value = true;

      emit("update:modelValue", file);

      if (target) {
        (target as HTMLInputElement).value = "";
      }
    }

    function reset() {
      if (input.value) {
        input.value.value = "";
      }
      filename.value = "";
      isUploaded.value = false;
    }

    onMounted(() => {
      uid.value = getUID();
    });

    return {
      input,
      uid,
      isUploaded,
      filename,
      uploadButtonTitle,
      onFileChanged,
      reset,
    };
  },
});
</script>

<style lang="stylus">
.custom-file-input
  @apply inline-flex items-center s('space-x-3.5')

  .file-button
    @apply relative overflow-hidden

    &.uploaded
      label
        @apply bg-white border text-primary s("hover:text-primary-hover") s("hover:bg-white")

    label
      @apply relative inline-block s("py-1.75") s("px-3.75") border border-transparent rounded bg-transparent text-base leading-normal space-x-2 cursor-pointer s("focus:outline-none")
      @apply bg-primary border-primary text-gray s("hover:bg-primary-hover") s("hover:border-primary-hover")

    input[type="file"]
      @apply absolute top-0 left-0

  .filename
    @apply s("p-1.75") border border-primary-lighter rounded bg-bg-middle text-base text-gray-2
</style>
