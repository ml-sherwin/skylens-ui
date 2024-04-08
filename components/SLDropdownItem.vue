<template lang="pug">
a(href="javascript:;", :class='{ active }').dropdown-item
  slot {{ title }}
</template>

<script lang="ts">
export default defineComponent({
  name: "SLDropdownItem",
  props: {
    title: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="stylus">
.dropdown-item
  @apply block p-2 bg-white text-sm text-primary whitespace-nowrap s('hover:text-primary') s('hover:bg-bg-middle') s('focus:text-primary') s('focus:bg-bg-middle') s('active:text-primary') s('active:bg-bg-middle')

  &.active
    @apply text-primary bg-bg-middle
</style>
