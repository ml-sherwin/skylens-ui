<template lang="pug">
.linear-progress-bar
  .linear-progress-bar-value
</template>

<script lang="ts">
export default defineComponent({
  name: "SLLinearProgressBar",
});
</script>

<style lang="stylus" scoped>
.linear-progress-bar
  @apply w-full h-2 overflow-hidden
  background-color #D3D3D3
  border-radius 1px

  &-value
    @apply w-full h-full
    background linear-gradient(270deg, rgba(211, 211, 211, 0.62) 0.08%, #E1E1E1 46.69%, rgba(211, 211, 211, 0.62) 100%)
    animation indeterminateAnimation 1s infinite linear
    transform-origin 0% 50%

@keyframes indeterminateAnimation {
  0% {
    transform  translateX(0) scaleX(0)
  }
  40% {
    transform  translateX(0) scaleX(0.4)
  }
  100% {
    transform  translateX(100%) scaleX(0.5)
  }
}
</style>
