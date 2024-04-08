<template lang="pug">
.breadcrumbs
  .breadcrumbs-container
    template(v-for="item, i in items")
      span.breadcrumb-divider(v-if="i > 0")  | 
      span.breadcrumb-item {{ item }}
  SLInfoTip(v-if="info !== ''" :info="info")
  .breadcrumbs-notice(v-if="$slots.notice")
    slot(name="notice")
</template>

<script lang="ts">
import type { PropType } from "vue";

export default defineComponent({
  name: "SLBreadcrumbs",
  components: {},
  props: {
    items: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    info: {
      type: String,
      default: "",
    },
  },
  setup() {},
});
</script>

<style lang="stylus">
.breadcrumbs
  @apply flex flex-wrap items-center justify-start text-lg text-primary font-bold

  &-container
    .breadcrumb-item:not(:last-child)
      @apply text-base font-normal

  &-notice
    @apply inline-flex items-center
</style>
