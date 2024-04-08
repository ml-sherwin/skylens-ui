<template lang="pug">
.sky-insight-site-page
  .sky-insight-site-page-header(v-if="$slots['site-page-header']")
    slot(name="site-page-header")
  .sky-insight-site-page-content
    slot
</template>

<script>
export default {
  name: 'SkyInsightSitePage',
  props: {},
  computed: {},
  methods: {},
};
</script>

<style lang="stylus">
.sky-insight-site-page
  @apply flex-grow flex flex-col

  &-header
    @apply s('-mx-4')

  &-content
    @apply flex flex-col flex-grow w-full p-4 rounded bg-bg-middle
</style>
