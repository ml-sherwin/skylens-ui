<template lang="pug">
li.siderbar-nav-item(:class="{ opened: isOpen, highlighted: isHighlight, included: isInclude, disabled: config && config.to === '' && config.subItems && config.subItems.length === 0 }")
  .nav-item-container
    .nav-item-wrapper
      a(href="javascript:;", @click="onClickedItem").nav-item-button
        .button-pre-icon(v-if="config && config.preIcon")
          SLIcon(:icon="config.preIcon")
        span.button-title {{ config ? config.title : '' }}
      a.nav-item-toggle(
        v-if="config && config.postIcon"
        href="javascript:;"
        @click="onClickedToggle"
      )
        SLIcon.button-post-icon(
          :icon="config.postIcon"
        )
      .nav-item-highlight-border
  .sub-items-wrapper(
    v-if="config && config.subItems && config.subItems.length > 0"
    :style="{ height: `${isOpen && !isSiderbarClosure ? subItemsWrapperHeight : 0}px` }"
  )
    ul(ref="subItemsUL")
      SLSiderbarNavItem(
        v-for="item, i in config.subItems"
        :config="item"
        :key="i"
      )
</template>

<script lang="ts">
import type { PropType } from "vue";
import { fromEvent, interval, Subscription } from "rxjs";
import { debounce, startWith } from "rxjs/operators";
import type { NavItemConfigType } from "~ui/interface/NavConfigType";

function getConfigPaths(paths: string[], config: NavItemConfigType | null) {
  if (!config) {
    return paths;
  }

  let newPaths = [...paths];

  if (config.subItems) {
    config.subItems.forEach((itemConfig) => {
      newPaths = getConfigPaths(newPaths, itemConfig);
    });
  }

  if (config.to) {
    newPaths.push(config.to);
  }

  if (config.include) {
    newPaths.push(...config.include);
  }

  return newPaths;
}

export default defineComponent({
  name: "SLSiderbarNavItem",
  components: {},
  props: {
    config: {
      type: Object as PropType<NavItemConfigType | null>,
      default: () => null,
    },
    isSiderbarClosure: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle", "click-item"],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();

    const { config, isSiderbarClosure } = toRefs(props);

    const subItemsUL = shallowRef<HTMLElement | null>(null);
    const isOpen = ref(false);
    const subItemsWrapperHeight = ref(0);

    let resizeSubscriber: Subscription | null = null;

    const configPaths = computed(() => {
      return getConfigPaths([], config.value);
    });

    const isInclude = computed(() => {
      let included = false;
      const matched = route.matched[route.matched.length - 1];

      configPaths.value.forEach((path) => {
        const regex = new RegExp(`${path}(/)?$`);
        if (regex.test(matched.path)) {
          included = true;
        }
      });

      return included;
    });

    const isHighlight = computed(() => {
      if (!config.value?.to) return false;

      const regex = new RegExp(`${config.value.to}(/)?$`);
      const matched = route.matched[route.matched.length - 1];

      return (
        regex.test(matched.path) ||
        ((config.value.subItems || []).length === 0 && isInclude.value)
      );
    });

    function isDefaultOpen() {
      let defaultOpen = false;

      configPaths.value.forEach((path) => {
        if (route.path.includes(path)) {
          defaultOpen = true;
        }
      });

      isOpen.value = defaultOpen;
    }

    function setSubItemsWrapperHeight() {
      nextTick(() => {
        if (subItemsUL.value) {
          subItemsWrapperHeight.value =
            subItemsUL.value.getBoundingClientRect().height;
        }
      });
    }

    function subscribeResize() {
      resizeSubscriber = fromEvent(window, "resize")
        .pipe(debounce(() => interval(500)))
        .pipe(startWith(0))
        .subscribe(setSubItemsWrapperHeight);
    }

    function unsubscribeResize() {
      if (resizeSubscriber) {
        resizeSubscriber.unsubscribe();
      }
      resizeSubscriber = null;
    }

    function onClickedItem() {
      if (isSiderbarClosure.value) {
        emit("toggle");
        return;
      }

      isOpen.value = !isOpen.value;

      if (config.value?.to && config.value?.to !== "") {
        router.push(config.value.to);
        return;
      }

      if (config.value?.emit && config.value?.emit !== "") {
        emit("click-item", config.value.emit);
      }
    }

    function onClickedToggle() {
      isOpen.value = !isOpen.value;
    }

    watch(route, () => {
      isDefaultOpen();
    });

    watch(config, () => {
      setSubItemsWrapperHeight();
      isDefaultOpen();
    });

    onMounted(() => {
      isDefaultOpen();
      subscribeResize();
    });

    onBeforeUnmount(() => {
      unsubscribeResize();
    });

    return {
      subItemsUL,
      isOpen,
      isHighlight,
      isInclude,
      subItemsWrapperHeight,
      onClickedItem,
      onClickedToggle,
    };
  },
});
</script>

<style lang="stylus"></style>
