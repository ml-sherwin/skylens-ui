<template lang="pug">
.ios-switch(
  :class="[`${size === '' ? '' : `ios-switch-${size}`}`, colorClass]"
  ref="el"
)
  input(
      type="checkbox"
      :id="uid"
      v-model="modelProxy"
      :true-value="trueValue",
      :false-value="falseValue",
    )
  label(:for="uid" :style="`width: ${labelWidth}px;`" ref="labelEl")
    span(ref="trueLabelEl").true-label {{ size === '' ? trueLabel : minTrueLabel }}
    span(ref="falseLabelEl").false-label {{ size === '' ? falseLabel : minFalseLabel }}
</template>

<script lang="ts">
import { getUID } from "~ui/utils";

export default defineComponent({
  name: "SLIOSSwitch",
  props: {
    modelValue: {
      type: [Number, String, Boolean],
      default: false,
    },
    trueLabel: {
      type: String,
      default: "",
    },
    minTrueLabel: {
      type: String,
      default: "",
    },
    trueValue: {
      type: [Number, String, Boolean],
      default: true,
    },
    falseLabel: {
      type: String,
      default: "",
    },
    minFalseLabel: {
      type: String,
      default: "",
    },
    falseValue: {
      type: [Number, String, Boolean],
      default: false,
    },
    size: {
      type: String,
      default: "",
      validator: (val: string) => ["", "min", "sm"].includes(val),
    },
    color: {
      type: String,
      default: "",
      validator: (val: string) => ["", "primary-hover"].includes(val),
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue, size, color } = toRefs(props);

    const el = shallowRef<HTMLElement | null>(null);
    const trueLabelEl = shallowRef<HTMLElement | null>(null);
    const falseLabelEl = shallowRef<HTMLElement | null>(null);
    const labelEl = shallowRef<HTMLElement | null>(null);
    const uid = ref<string | undefined>(undefined);
    const modelProxy = ref(modelValue.value);
    const labelWidth = ref(23);

    let timeoutId: any = null;
    let trueLabelObserver: MutationObserver | null = null;
    let falseLabelObserver: MutationObserver | null = null;

    const colorClass = computed(() => {
      if (color.value !== "") {
        return `ios-switch-${color.value}`;
      }

      return "";
    });

    async function caculateLabelWidth() {
      await nextTick();

      // 有時候會抓不到 width，所以 setTimeout 才抓取
      timeoutId = setTimeout(() => {
        let width = 23;
        const elRect = el.value?.getBoundingClientRect() || null;
        const trueLabelRect =
          trueLabelEl.value?.getBoundingClientRect() || null;
        const falseLabelRect =
          falseLabelEl.value?.getBoundingClientRect() || null;

        if (
          elRect &&
          trueLabelRect &&
          falseLabelRect &&
          labelEl.value &&
          size.value !== "min"
        ) {
          width = Math.ceil(
            Math.max(trueLabelRect.width, falseLabelRect.width, elRect.width)
          );
        }

        labelWidth.value = width;
      }, 10);
    }

    watch(modelValue, () => {
      modelProxy.value = modelValue.value;
    });
    watch(modelProxy, () => {
      emit("update:modelValue", modelProxy.value);
    });
    watch(size, caculateLabelWidth);

    onMounted(() => {
      uid.value = getUID();

      if (trueLabelEl.value) {
        trueLabelObserver = new MutationObserver(caculateLabelWidth);
        trueLabelObserver.observe(trueLabelEl.value, {
          characterData: true,
        });
      }
      if (falseLabelEl.value) {
        falseLabelObserver = new MutationObserver(caculateLabelWidth);
        falseLabelObserver.observe(falseLabelEl.value, {
          characterData: true,
        });
      }

      caculateLabelWidth();
    });

    onBeforeUnmount(() => {
      if (trueLabelObserver) {
        trueLabelObserver.disconnect();
      }
      if (falseLabelObserver) {
        falseLabelObserver.disconnect();
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      trueLabelObserver = null;
      falseLabelObserver = null;
      timeoutId = null;
    });

    return {
      el,
      trueLabelEl,
      falseLabelEl,
      labelEl,
      uid,
      modelProxy,
      labelWidth,
      colorClass,
    };
  },
});
</script>

<style lang="stylus">
.ios-switch
  @apply inline-block relative overflow-hidden

  &.ios-switch-min
    label
      @apply min-w-0 border-2 text-sm
      width 23px
      height 23px

      &:before
        @apply hidden

      .true-label, .false-label
        @apply p-0

  &.ios-switch-sm
    label
      @apply s('min-w-[52px]') s('h-[28px]') text-sm

      &:before
        @apply s('w-[20px]')

      .true-label
        @apply s('pr-[31px]')

      .false-label
        @apply s('pl-[31px]')

  &.ios-switch-primary-hover
    input:checked + label
      @apply bg-primary-hover border-primary

  input
    @apply absolute s('left-1/2') s('top-1/2') transform s('-translate-x-1/2') s('-translate-y-1/2')

  label
    @apply relative min-w-full s('h-[2.3125rem]') bg-bg border border-line rounded-full text-base leading-normal align-top cursor-pointer transition-colors

    &:before
      content ''
      @apply block absolute s('left-0.75') s('inset-y-0.75') s('w-7.25') bg-white rounded-full shadow

    span
      @apply flex items-center justify-center absolute top-0 left-0 min-w-full h-full whitespace-nowrap

    .true-label
      @apply pl-2 s('pr-[35px]') text-white opacity-0

    .false-label
      @apply s('pl-[35px]') pr-2 text-primary-hover opacity-100

  input:checked + label
    @apply bg-primary border-primary-heavy

    &:before
      @apply left-auto s('right-0.75')

    .true-label
      @apply opacity-100

    .false-label
      @apply opacity-0
</style>
