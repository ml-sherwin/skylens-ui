<template lang="pug">
component(:is="tag")
  slot
</template>

<script lang="ts">
export default defineComponent({
  name: "SLDirtributor",
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      default: "div",
    },
  },
  setup(_, { attrs }) {
    const distributed = computed(() => {
      return attrs;
    });

    provide("distributed", readonly(distributed.value));

    return {
      distributed,
    };
  },
});
</script>

<style lang="stylus"></style>
