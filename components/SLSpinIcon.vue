<template lang="pug">
SLIcon(:icon='icon').spin-icon
</template>

<script lang="ts">
export default defineComponent({
  name: "SLSpinIcon",
  components: {},
  props: {
    icon: {
      type: String,
      default: "",
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="stylus">
i.spin-icon
  @apply animate-spin
</style>
