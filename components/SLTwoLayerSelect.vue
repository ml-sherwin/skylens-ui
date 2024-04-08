<template lang="pug">
.tw-layer-select
  .select-header
    SLSearchInput(
      :modelValue='query',
      :placeholder='searchPlaceholder',
      :lazy='500',
      :isSearch='query !== ""',
      @update:modelValue='onInputedQuery'
      @clear="onClearQuery"
    )
  .select-body(v-if='firstLayers.length > 0')
    .menu(
      v-if="firstLayers.length > 1"
      ref='leftMenuEl'
    )
      .menu-header {{ firstLayerTitle }}
      .menu-body.custom-scrollbar-y
        .list
          a.item(
            v-for='layer in firstLayers',
            href='javascript:;',
            :class='{ selected: selectedFirstLayerKey === layer.key }',
            :key='layer.key',
            @click='onClickedCustomer(layer.key)'
          )
            span {{ layer.name }}
            //- .highlight-dot
    .select-body-divider(v-if="firstLayers.length > 1")
    .menu(ref='rightMenuEl')
      .menu-header {{ secondLayerTitle }}
      .menu-body.custom-scrollbar-y
        .list
          a.item(
            v-for='layer in secondLayers',
            href='javascript:;',
            :class='{ selected: !!modelValue && modelValue.secondLayer === layer.key }',
            :key='layer.key',
            @click='onClickedProject(layer.key)'
          )
            span {{ layer.name }}
            //- .highlight-dot
  .select-body-empty.flex.items-center.justify-center.h-full.pb-3.text-sm.text-gray-3(v-else-if='query !== "" && firstLayers.length === 0') {{ emptyMessage }}
</template>

<script lang="ts">
import type { PropType } from "vue";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default defineComponent({
  name: "SLTwoLayerSelect",
  components: {},
  props: {
    searchPlaceholder: {
      type: String,
      default: "",
    },
    firstLayerTitle: {
      type: String,
      default: "",
    },
    secondLayerTitle: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Object as PropType<{
        firstLayer: string;
        secondLayer: string;
      } | null>,
      default: null,
    },
    selectedFirstLayerKey: {
      type: String as PropType<string | null>,
      default: null,
    },
    query: {
      type: String,
      default: "",
    },
    firstLayers: {
      type: Array as PropType<Array<{ key: string; name: string }>>,
      default: () => [],
    },
    secondLayers: {
      type: Array as PropType<Array<{ key: string; name: string }>>,
      default: () => [],
    },
    emptyMessage: {
      type: String,
      default: "",
    },
  },
  emits: ["search", "selectFirstLayer", "update:modelValue"],
  setup(props, { emit }) {
    const { modelValue, firstLayers, secondLayers, selectedFirstLayerKey } =
      toRefs(props);

    const leftMenuEl = shallowRef<HTMLElement | null>(null);
    const rightMenuEl = shallowRef<HTMLElement | null>(null);

    function onInputedQuery(value: string) {
      emit("search", value);
    }

    function onClearQuery() {
      emit("search", "");
    }

    function onClickedCustomer(firstLayerKey: string) {
      emit("selectFirstLayer", firstLayerKey);
    }

    function onClickedProject(secondLayerKey: string) {
      emit("update:modelValue", {
        firstLayer: selectedFirstLayerKey.value,
        secondLayer: secondLayerKey,
      });
    }

    function scrollToValue() {
      const leftMenuBody = leftMenuEl.value?.querySelector(".menu-body");
      const rightMenuBody = rightMenuEl.value?.querySelector(".menu-body");

      if (!modelValue.value) {
        if (leftMenuBody) {
          gsap.to(leftMenuBody, { duration: 0.5, scrollTo: 0 });
        }

        if (rightMenuBody) {
          gsap.to(rightMenuBody, { duration: 0.5, scrollTo: 0 });
        }
        return;
      }

      const { firstLayer, secondLayer } = modelValue.value;
      const firstLayerIndex = firstLayers.value.findIndex(
        (l) => l.key === firstLayer
      );
      const secondLayerKey = secondLayers.value.findIndex(
        (l) => l.key === secondLayer
      );
      const firstLayerItems = leftMenuEl.value?.querySelectorAll(".item");
      const secondLayerItems = rightMenuEl.value?.querySelectorAll(".item");

      if (!firstLayerItems || !secondLayerItems) {
        return;
      }

      const selectedFirstLayerItem = firstLayerItems[firstLayerIndex];
      const selectedSecondLayerItem = secondLayerItems[secondLayerKey];

      if (selectedFirstLayerItem && leftMenuBody) {
        gsap.to(leftMenuBody, {
          duration: 0.5,
          scrollTo: selectedFirstLayerItem,
        });
      }

      if (selectedSecondLayerItem && rightMenuBody) {
        gsap.to(rightMenuBody, {
          duration: 0.5,
          scrollTo: selectedSecondLayerItem,
        });
      }
    }

    watch(modelValue, () => {
      scrollToValue();
    });

    watch(firstLayers, () => {
      if (firstLayers.value.length === 1) {
        const [firstLayer] = firstLayers.value;
        onClickedCustomer(firstLayer.key);
      } else {
        onClickedCustomer(modelValue.value?.firstLayer || "");
      }
      nextTick(() => {
        const leftMenuBody = leftMenuEl.value?.querySelector(".menu-body");
        if (leftMenuBody) {
          gsap.to(leftMenuBody, { duration: 0.5, scrollTo: 0 });
        }
      });
    });
    watch(secondLayers, () => {
      nextTick(() => {
        const rightMenuBody = rightMenuEl.value?.querySelector(".menu-body");
        if (rightMenuBody) {
          gsap.to(rightMenuBody, { duration: 0.5, scrollTo: 0 });
        }
      });
    });

    onMounted(() => {
      nextTick(() => {
        scrollToValue();
      });
    });

    return {
      leftMenuEl,
      rightMenuEl,
      onInputedQuery,
      onClearQuery,
      onClickedCustomer,
      onClickedProject,
      scrollToValue,
    };
  },
});
</script>

<style lang="stylus">
.tw-layer-select
  @apply flex flex-col s("h-67.75") s("pt-2.75") s("px-2.75") bg-white border border-bg rounded shadow
  width 552px

  .select-header
    @apply flex-grow-0 flex-shrink-0 mb-3

    .search-input
      .button-group
        @apply s('py-0.75')

    .text-input
      .input-group
        .input
          @apply s('py-1.25')

          input
            @apply text-sm

  .select-body
    @apply flex-grow flex overflow-hidden

    .menu
      @apply flex-grow flex flex-col text-base leading-normal overflow-hidden
      flex 1

      &:hover
        flex 1.5

      &-header
        @apply flex-grow-0 flex-shrink-0 w-full pb-2 text-primary border-b border-primary

      &-body
        @apply relative flex-grow

        .list
          .item
            @apply relative block s('py-1.5') px-2 s("hover:bg-bg-middle") text-sm text-gray-3 truncate

            &.selected
              @apply bg-bg text-primary

            .highlight-dot
              @apply absolute top-0 left-0 s('w-1.5') s('h-1.5') mt-2 ml-1 bg-red rounded-full

    &-divider
      @apply flex-grow-0 flex-shrink-0 w-px h-auto mb-3 s("mr-2.75") ml-3 bg-gray-4
</style>
