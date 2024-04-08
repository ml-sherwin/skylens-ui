<template lang="pug">
.tabs(:class='tabsClass')
  .tabs-nav(
    v-show="!tabItemsOversize"
    :class="{ show: !tabItemsOversize }"
  )
    .tabs-nav-left(ref='tabsNavLeftEl')
      SLDistributor(
        tag='ul',
        :header='true',
        :changeTabTo='changeTabTo',
        ref='navComp'
      )
        slot
    .tabs-nav-right(v-if='type === 1 && $slots["tabs-nav-right"]')
      slot(name='tabs-nav-right')
  .tabs-content
    SLDistributor
      .tabs-content-header(v-show="tabItemsOversize")
        .tabs-content-header-left
          SLDropdown.tabs-dropdown(
            :title='currentTab',
            v-model:showDropdown='showDropdown',
            :class='{ active: showDropdown }',
          )
            SLDropdownItem(
              v-for='(tabTitle, i) in tabTitles',
              :title='tabTitle',
              :class='{ active: i === activeTabIndex }',
              @click='onClickedTab(i)',
              :key='`${tabTitle}-${i}`'
            )
        .tabs-content-header-right(v-if='$slots["tabs-nav-right"]')
          slot(name='tabs-nav-right')
      .tabs-content-body(ref='tabsContentBody')
        slot
</template>

<script lang="ts">
import { fromEvent, interval, Subscription } from "rxjs";
import { debounce, startWith } from "rxjs/operators";
import { SLDistributor } from "#components";

type SLDistributorType = InstanceType<typeof SLDistributor>;

export default defineComponent({
  name: "SLTabs",
  components: {},
  props: {
    size: {
      type: String,
      default: "",
      validator: (value: string) => ["", "xs", "sm"].includes(value),
    },
    navMode: {
      type: String,
      default: "",
    },
    type: {
      type: Number,
      default: 1,
      validator: (value: number) => [1, 2, 3, 4].includes(value),
    },
    activeTab: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:activeTab"],
  setup(props, { emit }) {
    const { activeTab, size, type, navMode } = toRefs(props);

    const tabsContentBody = shallowRef<HTMLElement | null>(null);
    const tabsNavLeftEl = shallowRef<HTMLElement | null>(null);
    const navComp = shallowRef<SLDistributorType | null>(null);
    const activeTabIndex = ref(activeTab.value || 0);
    const tabTitles = ref<Array<string>>([]);
    const showDropdown = ref(false);
    const tabItemsOversizeProxy = ref(false);

    let observer: MutationObserver | null = null;
    let resizeSubscriber: Subscription | null = null;

    const tabsClass = computed(() => {
      const classes: Array<string> = [`tabs-type-${type.value}`];

      if (size.value !== "") {
        classes.push(`tabs-${size.value}`);
      }

      return classes.join(" ");
    });
    const currentTab = computed(() => {
      return tabTitles.value[activeTabIndex.value];
    });
    const tabItemsOversize = computed({
      get: () => {
        return (
          type.value !== 4 &&
          (tabItemsOversizeProxy.value || navMode.value === "dropdown")
        );
      },
      set: (newValue: boolean) => {
        tabItemsOversizeProxy.value = newValue;
      },
    });

    provide("activeTab", readonly(activeTabIndex));
    provide("initialTab", readonly(activeTab));

    function caculateTabs() {
      nextTick(() => {
        const tabLinks =
          navComp.value?.$el.querySelectorAll(".tab-nav-item-link");
        const tabLinkTitles = [];
        if (tabLinks) {
          for (let i = 0; i < tabLinks.length; i += 1) {
            tabLinkTitles.push((tabLinks[i] as HTMLElement).innerText);
          }
        }
        tabTitles.value = tabLinkTitles;

        const tabsNavLeftRect = tabsNavLeftEl.value?.getBoundingClientRect();
        const navRect = navComp.value?.$el?.getBoundingClientRect();

        if (tabsNavLeftRect && navRect) {
          tabItemsOversizeProxy.value = navRect.width > tabsNavLeftRect.width;
        }
      });
    }

    function changeTabTo(newTab: number) {
      activeTabIndex.value = newTab;
      emit("update:activeTab", newTab);
    }

    function onClickedTab(i: number) {
      changeTabTo(i);
    }

    watch(activeTab, () => {
      activeTabIndex.value = activeTab.value || 0;
    });

    onMounted(() => {
      resizeSubscriber = fromEvent(window, "resize")
        .pipe(debounce(() => interval(500)))
        .pipe(startWith(0))
        .subscribe(() => {
          caculateTabs();
        });

      if (navComp.value) {
        observer = new MutationObserver(caculateTabs);
        observer.observe(navComp.value.$el, {
          characterData: true,
          attributes: false,
          childList: true,
          subtree: true,
        });
      }
    });

    onBeforeUnmount(() => {
      if (resizeSubscriber) {
        resizeSubscriber.unsubscribe();
      }
      if (observer) {
        observer.disconnect();
      }
      resizeSubscriber = null;
      observer = null;
    });

    return {
      tabsContentBody,
      tabsNavLeftEl,
      navComp,
      activeTabIndex,
      tabTitles,
      showDropdown,
      tabItemsOversize,
      tabsClass,
      currentTab,
      changeTabTo,
      onClickedTab,
    };
  },
});
</script>

<style lang="stylus">
.tabs
  &.tabs-sm
    &.tabs-type-1
      & > .tabs-nav
        ul
          .tab-nav-item
            &-link
              @apply text-sm

  &.tabs-xs
    &.tabs-type-1
      & > .tabs-nav
        ul
          .tab-nav-item
            &.active
              &:before
                @apply hidden

            &-link
              @apply s("py-0.75") text-base

  &.tabs-type-1
    & > .tabs-nav
      @apply flex items-start justify-between h-0 space-x-8 overflow-hidden
      @apply s('lg:space-x-30')

      &.show
        @apply h-auto s("-mb-1.5")

      .tabs-nav-left
        @apply flex-grow overflow-hidden

      .tabs-nav-right
        @apply flex-grow-0 flex-shrink-0

      ul
        @apply inline-flex items-start s("-space-x-px")

        .tab-nav-item
          @apply relative rounded-t bg-white

          &:first-child
            .tab-nav-item-link
              &:after
                content ""
                @apply absolute bottom-0 left-0 w-px h-3 s("-mb-3") s("-ml-px") bg-border

          &.active
            @apply s("pb-1.75")

            &:before
              content ""
              @apply block absolute s("top-0.5") s("right-0.75") s("left-0.75") h-1 bg-secondary-hover

            .tab-nav-item-link
              @apply text-primary cursor-default

          &-link
            @apply relative block s("py-1.75") s("px-3.75") border-t border-r border-l border-border rounded-t text-lg text-primary-light

            &-title
              @apply truncate

        .tab-pane
          @apply space-y-8

    & > .tabs-content
      @apply p-4 border border-border rounded-lg bg-white overflow-hidden

      .tabs-content-header
        @apply flex items-start justify-between mb-4

  &.tabs-type-2
    & > .tabs-nav
      @apply mb-0

      ul
        @apply flex px-8 pb-5 space-x-8
        @apply s('lg:px-6') s('lg:space-x-14')

        .tab-nav-item
          @apply relative flex-grow s('py-6') rounded bg-bg text-lg text-primary-hover text-center
          @apply s('lg:py-5.5')

          &:before
            content ""
            @apply absolute s('top-0.5') s('left-0.5') block rounded bg-white
            width calc(100% - theme('spacing.1'))
            height calc(100% - theme('spacing.1'))

          &:after
            content ""
            @apply absolute left-0 bottom-0 s('-ml-4') s('-mb-5') block w-full h-3 rounded-t bg-primary-lighter opacity-0
            width calc(100% + theme('spacing.4') * 2)

          &.active
            @apply text-primary font-bold

            &:after
              @apply opacity-100

            &:nth-child(odd)
              @apply bg-transparent s('bg-gradient-to-r') s('from-insight-web-title-start') s('to-insight-web-title-end')

              &:after
                @apply bg-transparent s('bg-gradient-to-r') s('from-insight-web-title-start') s('to-insight-web-title-end')

            &:nth-child(even)
              @apply bg-transparent s('bg-gradient-to-r') s('from-insight-poi-title-start') s('to-insight-poi-title-end')

              &:after
                @apply bg-transparent s('bg-gradient-to-r') s('from-insight-poi-title-start') s('to-insight-poi-title-end')

            .tab-nav-item-link
              @apply cursor-default

          &-link
            @apply relative

  &.tabs-type-3
    & > .tabs-nav
      @apply flex items-start justify-between h-0 space-x-8 overflow-hidden
      @apply s('lg:space-x-30')

      &.show
        @apply h-auto mb-1

      .tabs-nav-left
        @apply flex-grow overflow-hidden

      .tabs-nav-right
        @apply flex-grow-0 flex-shrink-0

      ul
        @apply inline-flex items-start space-x-2

        .tab-nav-item
          @apply relative rounded-t bg-bg

          &.active
            @apply bg-primary

            .tab-nav-item-link
              @apply text-white cursor-default

          &-link
            @apply relative block py-2 px-8 rounded-t text-base text-primary

            &-title
              @apply truncate

        .tab-pane
          @apply space-y-8

    & > .tabs-content
      @apply p-6 rounded-tr-lg rounded-b-lg bg-white shadow overflow-hidden

      .tabs-content-header
        @apply flex items-start justify-between

      .tabs-dropdown
        @apply mb-4

  &.tabs-type-4
    @apply flex

    & > .tabs-nav
      @apply flex-grow-0 flex-shrink-0

      .tabs-nav-left
        ul
          @apply flex flex-col s('space-y-0.5')

          .tab-nav-item
            @apply flex justify-between s('w-[184px]') py-3 pl-3 pr-5 bg-bg-middle rounded-l-lg text-xs

            &.active
              @apply bg-primary-hover text-white font-bold shadow-md

            &-link
              @apply block w-full

    .tabs-content
      @apply flex-grow s('-ml-2') p-4 bg-white border border-border rounded-lg shadow-md

      & > div
        @apply flex min-h-full

        .tabs-content-body
          @apply w-full

  & > .tabs-content
    .tabs
      & > .tabs-content
        @apply shadow-md
</style>
