<template lang="pug">
SLModal(
    :show="show"
    :title="title"
    size="xs"
    :backdrop="backdrop"
    :closeButton="false"
    modalClass='warn-modal'
    @update:show="onUpdatedShow"
  )
  SLIcon(:icon="icon" :class="iconClass")
  p {{ message }}
</template>

<script lang="ts">
export default defineComponent({
  name: "SLWarnModal",
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    backdrop: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const { color } = toRefs(props);

    const iconClass = computed(() => {
      if (color.value === "") return "";

      return `text-${color.value}`;
    });

    function onUpdatedShow(isShow: boolean) {
      emit("update:show", isShow);
    }

    return {
      iconClass,
      onUpdatedShow,
    };
  },
});
</script>

<style lang="stylus">
.warn-modal
  .modal-body
    &-content
      @apply flex flex-col items-center space-y-6 text-base text-gray-2

      .icon
        @apply text-16xl
</style>
