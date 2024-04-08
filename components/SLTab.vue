<template lang="pug">
li(
    v-if="distributed && distributed.header"
    :class="tabNavItemClass"
    @click="navClick"
    ref='tabPaneEl'
  )
  a(
      href="javascript:;"
    ).tab-nav-item-link
    .tab-nav-item-link-title
      .inline-flex.items-center.justify-center.w-full.space-x-1
        slot(name="title")
          SLIcon(v-if="icon", :icon="icon")
          span {{ title }}
div(
  v-else
  :class="{ active: isActive }"
  ref='tabPaneEl'
)
  .tab-pane(
      v-if="isActive"
      :class="{ active: isActive }"
    )
    slot
</template>

<script lang="ts">
import type { Ref } from "vue";

export default defineComponent({
  name: "SLTab",
  components: {},
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      require: true,
      default: -1,
    },
    activeTabBorderColor: {
      type: String,
      default: "",
      validator: (val: string) =>
        [
          "",
          "insight-web-1",
          "insight-poi-1",
          "insight-1",
          "insight-2",
          "insight-3",
        ].includes(val),
    },
    single: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { order, activeTabBorderColor, single } = toRefs(props);

    const distributed = inject<{
      header: boolean;
      changeTabTo: (newTab: number) => void;
    }>("distributed");
    const activeTab = inject<Ref<number>>("activeTab");
    const initialTab = inject<Ref<number>>("initialTab");
    const self = getCurrentInstance();
    const parent = self?.parent?.parent;

    const tabPaneEl = shallowRef<HTMLElement | null>(null);
    const index = ref<number | null>(null);

    const isActive = computed(() => {
      return activeTab && activeTab.value === index.value;
    });
    const tabNavItemClass = computed(() => {
      const classes = ["tab-nav-item"];

      if (isActive.value) {
        classes.push("active");
      }

      if (activeTabBorderColor.value !== "") {
        classes.push(`tab-nav-item-${activeTabBorderColor.value}`);
      }

      if (single.value) {
        classes.push("single");
      }

      return classes.join(" ");
    });

    function navClick() {
      if (!isActive.value && distributed && distributed.changeTabTo) {
        distributed.changeTabTo(index.value || 0);
      }
    }

    function setupIndex() {
      if (!distributed) return;

      if (order.value < 0) {
        const contentBody = (
          distributed.header
            ? parent?.refs?.tabsNavLeftEl
            : parent?.refs?.tabsContentBody
        ) as HTMLElement;
        if (!contentBody) return;

        const tabsElement = distributed.header
          ? contentBody.querySelectorAll(".tab-nav-item")
          : contentBody.children;
        index.value = tabPaneEl.value
          ? Array.from(tabsElement).indexOf(tabPaneEl.value)
          : null;
      } else {
        index.value = order.value;
      }
    }

    watch(order, () => {
      setupIndex();
    });

    onMounted(() => {
      setupIndex();

      if (
        isActive.value &&
        distributed &&
        distributed.header &&
        (!initialTab || !initialTab.value)
      ) {
        distributed.changeTabTo(index.value || 0);
      }
    });

    return {
      distributed,
      activeTab,
      tabPaneEl,
      isActive,
      tabNavItemClass,
      navClick,
    };
  },
});
</script>

<style lang="stylus"></style>
