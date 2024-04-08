<template lang="pug">
label.pill-label(:class="pillClass")
  span {{ label }}
  SLIcon(v-if="icon" :icon="icon")
</template>

<script lang="ts">
export default defineComponent({
  name: "SLPillLabel",
  components: {},
  props: {
    label: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: "",
      validator: (value: string) => ["", "sm", "xs"].includes(value),
    },
    color: {
      type: String,
      default: "",
      validator: (value: string) =>
        [
          "",
          "third",
          "third-7",
          "primary",
          "primary-hover",
          "secondary-line",
          "blue-1",
          "blue-2",
          "white",
        ].includes(value),
    },
  },
  setup(props) {
    const { size, color } = toRefs(props);

    const pillClass = computed(() => {
      const classes = [];
      if (size.value && size.value !== "") {
        classes.push(`pill-label-${size.value}`);
      }

      if (color.value && color.value !== "") {
        classes.push(`pill-label-${color.value}`);
      }
      return classes.join(" ");
    });

    return {
      pillClass,
    };
  },
});
</script>

<style lang="stylus">
.pill-label
  @apply inline-flex justify-center items-center relative s('px-1.75') s('py-0.75')
  @apply bg-white border border-white rounded-full text-sm s('leading-4.75') text-white font-bold align-top whitespace-nowrap

  &.pill-label-xs
    @apply py-px text-xs

  &.pill-label-sm
    @apply py-px text-sm

  &.pill-label-white
    @apply text-gray-2

  &.pill-label-third
    @apply bg-third border-third

  &.pill-label-third-7
    @apply bg-third-7 border-third-7

  &.pill-label-primary
    @apply bg-primary border-primary

  &.pill-label-primary-hover
    @apply bg-primary-hover border-primary-hover

  &.pill-label-secondary-line
    @apply bg-secondary-line border-secondary-line

  &.pill-label-blue-1
    @apply bg-blue-1 border-blue-1

  &.pill-label-blue-2
    @apply bg-blue-2 border-blue-2

  .icon
    @apply inline-block ml-2
</style>
