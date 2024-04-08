<template lang="pug">
.insight-site-page
  .insight-site-page-header(v-if="$slots['site-page-header']")
    slot(name="site-page-header")
  .insight-site-page-content
    slot
</template>

<script>
export default {
  name: "SLInsightSitePage",
  props: {},
  computed: {},
  methods: {},
};
</script>

<style lang="stylus">
.insight-site-page
  @apply flex-grow flex flex-col

  &-header
    @apply s('-mx-4')

  &-content
    @apply flex flex-col flex-grow w-full p-4 rounded bg-bg-middle
</style>
