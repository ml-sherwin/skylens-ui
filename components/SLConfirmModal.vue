<template lang="pug">
SLModal(
    :show="show"
    :title="title"
    :size="size"
    :backdrop="true"
    :close-button='closeButton'
    :closeOnBackdrop="closeOnBackdrop"
    :modalClass='allModalClass'
    @update:show="onUpdatedShow"
  )
  slot
  template(#footer)
    slot(name="footer")
      .confirm-modal-footer
        SLButton(
            :color="cancelButtonColor"
            size="lg"
            :title="cancelButtonTitle"
            @click="onClickedCancel"
          )
        SLButton(
            :color="confirmButtonColor"
            size="lg"
            :title="confirmButtonTitle"
            :variant="confirmButtonVariant"
            @click="onClickedConfirm"
          )
</template>

<script lang="ts">
export default defineComponent({
  name: "SLConfirmModal",
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
    cancelButtonTitle: {
      type: String,
      default: "取消",
    },
    cancelButtonColor: {
      type: String,
      default: "cancel",
    },
    confirmButtonTitle: {
      type: String,
      default: "確定",
    },
    confirmButtonColor: {
      type: String,
      default: "primary",
    },
    confirmButtonVariant: {
      type: String,
      default: "outline",
      validator: (value: string) => ["", "outline"].includes(value),
    },
    modalClass: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "xs",
    },
    closeButton: {
      type: Boolean,
      default: true,
    },
    closeOnBackdrop: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:show", "cancel", "confirm"],
  setup(props, { emit }) {
    const { modalClass } = toRefs(props);

    const allModalClass = computed(() => {
      const allClass = modalClass.value.split(" ");
      allClass.push("confirm-modal");
      return allClass.join(" ");
    });

    function onClickedCancel() {
      emit("cancel");
      emit("update:show", false);
    }

    function onClickedConfirm() {
      emit("confirm");
    }

    function onUpdatedShow(value: boolean) {
      emit("update:show", value);
    }

    return {
      allModalClass,
      onClickedCancel,
      onClickedConfirm,
      onUpdatedShow,
    };
  },
});
</script>

<style lang="stylus">
.confirm-modal
  .modal-backdrop
    @apply s('bg-white/40') backdrop-blur-5

  &-footer
    @apply flex justify-center space-x-4
</style>
