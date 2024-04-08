<template lang="pug">
.site-page
  slot(name="site-page-header")
    .site-page-header
      .site-page-header-left
        .site-page-header-left-top
          #breadcrumbs
          #site-page-datasources(
            :style="`margin-left: ${dataSourcesMargin}px;`"
            ref="dataSourcesTarget"
          )
        #site-page-header-left-bottom
      .site-page-header-right
  .site-page-notice(v-if="notice !== '' || $slots.notice")
    slot(name="notice") {{ notice }}
  .site-page-content
    slot
  .site-page-footer
    slot(name='site-page-footer')
</template>

<script lang="ts">
export default defineComponent({
  name: "SLSitePage",
  components: {},
  props: {
    notice: {
      type: String,
      default: "",
    },
  },
  setup() {
    const dataSourcesTarget = shallowRef<HTMLElement | null>(null);
    const dataSourcesMargin = ref(0);

    let mutationObserver: MutationObserver | null = null;

    function onDataSourcesTargetChange() {
      nextTick(() => {
        dataSourcesMargin.value =
          dataSourcesTarget.value && dataSourcesTarget.value.children.length > 0
            ? 16
            : 0;
      });
    }

    onMounted(() => {
      if (dataSourcesTarget.value) {
        mutationObserver = new MutationObserver(() => {
          onDataSourcesTargetChange();
        });
        mutationObserver.observe(dataSourcesTarget.value, {
          childList: true,
          attributes: false,
          characterData: false,
          subtree: false,
        });
      }
    });

    onBeforeUnmount(() => {
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      mutationObserver = null;
    });

    return {
      dataSourcesTarget,
      dataSourcesMargin,
      onDataSourcesTargetChange,
    };
  },
});
</script>

<style lang="stylus">
.site-page
  @apply flex flex-col w-full min-h-full pt-1

  &-header
    @apply flex justify-between mb-4

    &-left
      &-top
        @apply flex items-center justify-start

      #site-page-header-left-bottom
        @apply flex mt-2

  &-notice
    @apply mb-4 pl-2 pr-20 py-3 s('bg-[#FBFCFF]') rounded-lg text-sm text-gray-2

  &-content
    @apply flex flex-col flex-grow w-full px-4 pt-4 pb-8 rounded-lg bg-white
</style>
