<template lang="pug">
.text-input abc
//- SLTextInput(
//-   :size='size'
//-   :modelValue="modelValue"
//-   :placeholder="placeholder"
//-   :lazy="lazy"
//-   @update:modelValue='onInputedValue'
//- ).search-input
//-   template(#append)
//-     .button-group
//-       .button-group-divider
//-       SLButton(v-if="!isSearch", :size='size' @click.prevent="onClickedSearch").btn-search
//-         SLIcon(icon="search").icon-search
//-       SLButton(v-else, :size='size' @click.prevent="onClickedClear").btn-clear
//-         SLIcon(icon="times").icon-times
</template>

<script lang="ts">
export default defineComponent({
  name: "SLSearchInput",
  components: {},
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    lazy: {
      type: [Boolean, Number],
      default: true,
    },
    isSearch: {
      type: Boolean,
      defalut: false,
    },
    size: {
      type: String,
      default: "",
      valiator: (val: string) => ["", "sm"].includes(val),
    },
  },
  emits: ["search", "clear", "update:modelValue", "update:value"],
  setup(_, { emit }) {
    function onClickedSearch(e: Event) {
      emit("search", e);
    }

    function onClickedClear(e: Event) {
      emit("clear", e);
    }

    function onInputedValue(newValue: string) {
      emit("update:modelValue", newValue);
    }

    function onUpdatedValue(newValue: string) {
      emit("update:value", newValue);
    }

    return {
      onClickedSearch,
      onClickedClear,
      onInputedValue,
      onUpdatedValue,
    };
  },
});
</script>

<style lang="stylus">
.search-input
  .is-focus
    .button-group
      @apply border-primary

  .button-group
    @apply inline-flex items-center h-full s('py-1.25') border-t border-r border-b border-primary-light rounded rounded-l-none bg-white

    &-divider
      @apply s('w-[0.0625rem]') h-full bg-primary-light

    .btn
      @apply s('p-0') s('mx-1.75') leading-none text-gray-3 s('focus:outline-none') s('active:outline-none')
</style>
