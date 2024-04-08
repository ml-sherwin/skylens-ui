<template lang="pug">
div(v-if="show")
  .page-modal-backdrop
  .page-modal.custom-scrollbar-y(
      ref="modalEl"
    )
      .modal-dialog
        slot
</template>

<script lang="ts">
export default defineComponent({
  name: "SLPageModal",
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { show } = toRefs(props);

    const modalEl = shallowRef<HTMLElement | null>(null);
    const modalScrollbarEl = shallowRef<HTMLElement | null>(null);

    watch(show, () => {
      const body = document.querySelector("body");
      if (!body) return;

      if (show.value) {
        body.classList.add("popup");
      } else {
        body.classList.remove("popup");
      }
    });

    onBeforeUnmount(() => {
      const body = document.querySelector("body");
      if (body) {
        body.classList.remove("popup");
      }
    });

    return {
      modalEl,
      modalScrollbarEl,
    };
  },
});
</script>

<style lang="stylus">
.page-modal-backdrop
  @apply fixed top-0 left-0 w-full h-full s('bg-white/70') backdrop-blur-8

.page-modal
  @apply fixed top-0 left-0 w-full h-full overflow-auto

  .modal-dialog
    @apply flex items-center justify-center relative m-8 rounded-lg bg-white shadow-popup-lg overflow-hidden
    width calc(100% - theme('spacing.8') * 2)
    height calc(100% - theme('spacing.8') * 2)
</style>
