<template lang="pug">
.profile-button(ref='el')
  a(
      href="javascript:;"
      @click.stop.prevent="onClickedToggle"
      ref="toggleEl"
    ).btn.toggle-button {{ title }}
  ClientOnly
    Teleport(to="body")
      .profile-nav-popup(ref="popupEl")
        .profile-nav-popup-body
          a(
              v-if="showEditProfile"
              href="javascript:;"
              @click="onClickedEdit"
            ).profile-nav-item
            SLIcon(icon="person-cog")
            span 個人資料維護
          .profile-nav-divider(v-if="showEditProfile")
          a(href="javascript:;" @click="onClickedLogout").profile-nav-item
            SLIcon(icon="sign-out-alt")
            span 登出
</template>

<script lang="ts">
import { fromEvent } from "rxjs";
import { createPopper } from "@popperjs/core";

export default defineComponent({
  name: "SLProfileButton",
  components: {},
  props: {
    username: {
      type: String,
      default: "SKYLENS",
    },
  },
  emits: ["edit", "logout"],
  setup(props, { emit }) {
    const { username } = toRefs(props);

    const el = shallowRef<HTMLElement | null>(null);
    const toggleEl = shallowRef<HTMLElement | null>(null);
    const popupEl = shallowRef<HTMLElement | null>(null);

    let popperInstance: any = null;
    let clickSubscriber: any = null;

    const title = computed(() => {
      if (username.value === "") {
        return "";
      }

      return username.value.slice(0, 1);
    });
    const showEditProfile = computed(() => {
      // return $acl.can('/application/profile/edit');
      return true;
    });

    function onClickedToggle() {
      if (!popupEl.value || popupEl.value.getAttribute("data-show") !== null) {
        hide();
        return;
      }

      show();
    }

    function subscribeClick() {
      clickSubscriber = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (el.value && !el.value.contains(target as HTMLElement)) {
          hide();
        }
      });
    }

    function unsubscribeClick() {
      if (clickSubscriber) {
        clickSubscriber.unsubscribe();
      }
      clickSubscriber = null;
    }

    function show() {
      subscribeClick();
      if (popupEl.value) {
        popupEl.value.setAttribute("data-show", "");
      }

      popperInstance.setOptions({
        strategy: "fixed",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
          { name: "eventListeners", enabled: true },
        ],
      });

      popperInstance.update();
    }

    function hide() {
      if (popupEl.value && popupEl.value.getAttribute("data-show") === null)
        return;

      unsubscribeClick();

      if (popupEl.value) {
        popupEl.value.removeAttribute("data-show");
      }
      popperInstance.setOptions({
        modifiers: [{ name: "eventListeners", enabled: false }],
      });
    }

    function onClickedEdit() {
      emit("edit");
      hide();
    }

    function onClickedLogout() {
      emit("logout");
      hide();
    }

    onMounted(() => {
      nextTick(() => {
        if (toggleEl.value && popupEl.value) {
          popperInstance = createPopper(toggleEl.value, popupEl.value, {
            placement: "bottom-end",
            modifiers: [{ name: "eventListeners", enabled: false }],
          });
        }
      });
    });
    onBeforeUnmount(() => {
      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;
    });

    return {
      el,
      toggleEl,
      popupEl,
      title,
      showEditProfile,
      onClickedToggle,
      subscribeClick,
      unsubscribeClick,
      show,
      hide,
      onClickedEdit,
      onClickedLogout,
    };
  },
});
</script>

<style lang="stylus">
.profile-button
  .toggle-button
    @apply inline-flex items-center justify-center w-10 h-10 p-0 rounded-full s('bg-primary/80') s('text-2.67xl') s('leading-9.25') text-card-primary-light font-bold

.profile-nav-popup
  @apply z-60 absolute s('min-w-[10.25rem]') p-4 border border-primary bg-bg-middle rounded shadow-popup-lg pointer-events-none invisible

  &[data-show]
    @apply visible pointer-events-auto

  &-body
    @apply flex flex-col space-y-2

  .profile-nav-item
    @apply inline-flex items-center space-x-2 text-base text-primary-hover s('hover:text-primary')

  .profile-nav-divider
    @apply w-full h-px bg-border
</style>
