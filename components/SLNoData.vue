<template lang="pug">
.no-data(:class='{ "no-data--sm": size === "sm" }')
  img(src="~uiAssets/images/commons/empty-box.png")
  .no-data-title {{ title }}
  .no-data-reason(v-if='reason') 可能的原因：{{ reason }}
</template>

<script lang="ts">
export default defineComponent({
  name: "SLNoData",
  components: {},
  props: {
    title: {
      type: String,
      default: "無資料",
    },
    reason: {
      type: String,
      default: "數據未匯入，或是未選擇網站",
    },
    size: {
      type: String as PropType<"" | "sm">,
      default: "",
    },
  },
  setup() {},
});
</script>

<style lang="stylus" scoped>
.no-data
  @apply flex flex-col items-center w-full py-8 px-4 space-y-3 bg-white rounded-lg

  &--sm
    .no-data-title
      @apply text-sm

  &-title
    @apply text-lg text-primary-light

  &-reason
    @apply text-sm text-gray-3
</style>
