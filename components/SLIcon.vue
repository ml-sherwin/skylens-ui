<template lang="pug">
i(:class="iconClass").icon
</template>

<script lang="ts">
export default defineComponent({
  name: "SLIcon",
  props: {
    icon: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const { icon } = toRefs(props);

    const iconClass = computed(() => {
      if (icon.value && icon.value !== "") {
        return `icon-${icon.value}`;
      }

      return "";
    });

    return {
      iconClass,
    };
  },
});
</script>

<style lang="stylus">
i.icon
  @apply inline-block leading-none
</style>
