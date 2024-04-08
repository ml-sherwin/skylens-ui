<template lang="pug">
.card
  .card-header(
    v-if='title !== "" || $slots.header || $slots.title || $slots["title-container"] || desc !== "" || $slots.desc || $slots["header-left"] || $slots["header-right"]'
  )
    slot(name='header')
      .header-left
        slot(name='header-left')
          .card-title(v-if='title !== "" || $slots.title || $slots["title-container"]')
            .card-title-container
              slot(name="title-container")
                slot(name="title") {{ title }}
                SLIcon.title-icon(v-if='titleIcon !== ""', :icon='titleIcon')
                SLInfoTip(
                  v-if='info !== "" || !!$slots.info', :info='info'
                  data-skip-download
                )
                  slot(name="info")
            .card-title-border
        .inline-info(v-if='inlineInfo !== ""') {{ inlineInfo }}
      .header-right
        slot(name='header-right')
          .card-desc(v-if='desc !== "" || $slots.desc')
            slot(name='desc') {{ desc }}
  .card-body
    slot
  .card-footer(v-if="$slots.footer")
    slot(name='footer')
</template>

<script lang="ts">
export default defineComponent({
  name: "SLCard",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    titleIcon: {
      type: String,
      default: "",
    },
    info: {
      type: String,
      default: "",
    },
    inlineInfo: {
      type: String,
      default: "",
    },
    desc: {
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
.tabs
  .tabs
    .card
      @apply border-0 rounded-none shadow-none

  .card
    @apply rounded-lg border-primary-lighter shadow-md

    .card
      @apply border-0 rounded-none shadow-none

.card
  @apply p-4 border border-border rounded bg-white shadow

  .card-header
    @apply flex justify-between mb-4

    .card-title
      @apply inline-flex flex-col

      &-container
        @apply inline-flex items-center mb-2 text-lg text-primary

        .title-icon
          @apply ml-2

      &-border
        @apply s('h-0.5') rounded-full bg-secondary

    .card-desc
      @apply text-base text-gray-2

      .date-range
        @apply ml-2 text-sm text-gray-3

    .inline-info
      @apply mt-2 text-sm text-gray-3

  .card-body
    @apply relative

  .card-footer
    @apply mt-4 pb-2 border-b s('border-primary-lighter/30')

  .card
    @apply border-primary-lighter rounded-lg shadow-md

    .card-header
      .card-title
        &-container
          @apply mb-0 text-base text-gray-2

        &-border
          @apply hidden
</style>
