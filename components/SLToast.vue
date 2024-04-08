<template lang="pug">
Transition(name='toast-fade')
  .toast(v-if='show')
    .toast-wrapper {{ message }}
</template>

<script lang="ts">
export default defineComponent({
  name: "SLToast",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const { show } = toRefs(props);

    let showTimeoutId: any = null;

    function clearShowTimeout() {
      if (showTimeoutId) {
        clearTimeout(showTimeoutId);
      }
      showTimeoutId = null;
    }

    function setupHideTimeout() {
      clearShowTimeout();

      showTimeoutId = setTimeout(() => {
        emit("update:show", false);
      }, 1300);
    }

    watch(show, () => {
      if (show.value) {
        setupHideTimeout();
      }
    });

    onBeforeUnmount(() => {
      clearShowTimeout();
    });

    return {};
  },
});
</script>

<style lang="stylus" scoped>
.toast
  @apply fixed top-0 left-0 w-full h-full pointer-events-none

  &-wrapper
    @apply absolute s('top-1/2') s('left-1/2') py-4 px-6 s('bg-backdrop/80') rounded text-base text-white s('-translate-x-1/2') s('-translate-y-1/2')

.toast-fade-enter-active
  @apply transition-opacity duration-300 ease-linear

.toast-fade-leave-active
  @apply transition-opacity duration-200 ease-linear

.toast-fade-enter-from, .toast-fade-leave-to
  @apply opacity-0
</style>
