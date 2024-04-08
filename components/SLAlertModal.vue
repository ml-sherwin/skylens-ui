<template lang="pug">
SLModal(
    :show="show"
    :title="title"
    size="xs"
    :backdrop="true"
    :closeOnBackdrop="false"
    modalClass='alert-modal'
    @update:show="onUpdatedShow"
  )
  slot
    SLIcon(
        v-if="color === 'primary'"
        icon="check-circle"
      ).text-secondary
    SLIcon(
        v-else
        icon="exclamation-triangle"
        :class="color === '' ? '' : `text-${color}-hover`"
      )
    p(v-html='message')
  template(#footer)
    SLButton(
        color="primary"
        size="lg"
        :title="buttonTitle"
        @click="onClickedConfirm"
      )
</template>

<script lang="ts">
export default defineComponent({
  name: "SLAlertModal",
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
    buttonTitle: {
      type: String,
      default: "確定",
    },
    color: {
      type: String,
      default: "secondary",
      validator: (value: string) =>
        ["", "primary", "secondary", "danger"].includes(value),
    },
    message: {
      type: String,
      default: "",
    },
  },
  emits: ["update:show"],
  setup(_, { emit }) {
    function onClickedConfirm() {
      emit("update:show", false);
    }

    function onUpdatedShow(value: boolean) {
      emit("update:show", value);
    }

    return {
      onClickedConfirm,
      onUpdatedShow,
    };
  },
});
</script>

<style lang="stylus">
.alert-modal
  @apply z-60

  .modal-backdrop
    @apply s('bg-white/40') backdrop-blur-5

    &.show
      @apply s('bg-white/40')

  .modal-body
    &-content
      @apply text-base leading-6 text-gray-2 text-center space-y-4

      .icon
        @apply s('text-7.17xl')

      p
        @apply whitespace-pre-wrap

  .modal-footer
    @apply flex justify-center
</style>
