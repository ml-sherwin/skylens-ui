<template lang="pug">
SLModal(
  v-model:show="showProxy"
  title="建立專案"
  size="xs"
  :backdrop="true"
).save-as-project-modal
  .save-as-project-modal-content
    .save-as-project-modal-content-body
      .form-group
        SLTextInput(
          name="projectName"
          label="專案名稱"
          :required="true"
          v-model.trim="projectName"
          :isInvalid="projectNameInvalidFeedback !== ''"
          :invalidFeedback="projectNameInvalidFeedback"
        )
      .form-group.form-group--members(:style='`height: ${membersGroupHeight}px`', ref='membersGroupEl')
        .form-group-wrapper(ref='membersEl')
          SLMultiEmailInput(
            :collapsable="true"
            :collapsed='isMembersGroupCollapsed'
            :org-members='orgMembers'
            :modelValue="inputEmails"
            :recommend-emails="recommendShareUsers"
            v-model:role='shareUserRoleProxy'
            @remove:email="removeInputEmail"
            @paste:emails="pasteEmails"
            @enter:email="enterEmail"
            @add="onAddedShares"
            @toggle:collapse="onToggleCollapse"
          )
          .save-as-project-modal-content-shares(v-if="projectShares.length > 0")
            .save-as-project-modal-content-shares-body
              SLProjectShareItem(
                v-for="projectShare in projectShares" :key="projectShare.email"
                :email="projectShare.email"
                :model-value="projectShare.role"
                @update:model-value='onUpdateMemberRole'
                @delete="onDeleteProjectShare"
              )
    .save-as-project-modal-content-footer
      a.cancel-button(
        href="javascript:;"
        @click="onClickedCancelSaveAsProject"
      ) 取消
      SLButton(
        title="儲存專案"
        color="primary"
        size="lg"
        @click="onClickedSaveAsProject"
      )
    .save-as-project-modal-content-notice {{ organization }} 剩餘可用專案額度 ({{ projectsQuota }})
</template>

<script lang="ts">
import type { PropType } from "vue";
import gsap from "gsap";
import { OrgUserRole } from "~ui/interface/IOrganization";

export default defineComponent({
  name: "SLSaveAsProjectModal",
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    inputEmails: {
      type: Array as PropType<
        {
          email: string;
          status: "loading" | "success" | "warn";
        }[]
      >,
      default: () => [],
    },
    projectShares: {
      type: Array as PropType<
        {
          email: string;
          role: OrgUserRole;
        }[]
      >,
      default: () => [],
    },
    organization: {
      type: String,
      default: "",
    },
    projectsQuota: {
      type: [Number, String],
      default: 0,
    },
    isFetchingRecommendShareUsers: {
      type: Boolean,
      default: false,
    },
    recommendShareUsers: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    orgMembers: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    shareUserRole: {
      type: String as PropType<OrgUserRole>,
      default: OrgUserRole.Normal,
    },
  },
  emits: [
    "update:show",
    "remove:email",
    "paste:emails",
    "enter:email",
    "add",
    "update:role",
    "delete",
    "cancel",
    "save",
    "update:shareUserRole",
  ],
  setup(props, { emit }) {
    const { show, shareUserRole } = toRefs(props);

    const membersGroupEl = shallowRef<HTMLDivElement | null>(null);
    const membersEl = shallowRef<HTMLDivElement | null>(null);
    const projectName = ref("");
    const projectNameInvalidFeedback = ref("");
    const membersGroupHeight = ref(0);
    const isMembersGroupCollapsed = ref(true);

    let tween: gsap.core.Tween | null = null;

    const showProxy = computed({
      get: () => show.value,
      set: (newValue) => {
        emit("update:show", newValue);
      },
    });
    const shareUserRoleProxy = computed({
      get: () => shareUserRole.value,
      set: (newValue) => emit("update:shareUserRole", newValue),
    });

    function removeInputEmail(email: string) {
      emit("remove:email", email);
    }

    function pasteEmails(emails: string[]) {
      emit("paste:emails", emails);
    }

    function enterEmail(email: string) {
      emit("enter:email", email);
    }

    function onAddedShares() {
      emit("add");
    }

    function onUpdateMemberRole(email: string, role: OrgUserRole) {
      emit("update:role", email, role);
    }

    function onDeleteProjectShare(email: string) {
      emit("delete", email);
    }

    function onClickedCancelSaveAsProject() {
      emit("cancel");
    }

    function onClickedSaveAsProject() {
      if (projectName.value === "") {
        projectNameInvalidFeedback.value = "請填寫專案名稱";
        return;
      }

      emit("save", projectName.value);
    }

    function setupMembersGroupHeight() {
      nextTick(() => {
        if (!membersGroupEl.value || !membersEl.value) return;

        if (tween) {
          tween.kill();
        }
        tween = null;
        membersGroupEl.value.classList.add("overflow-hidden");

        if (isMembersGroupCollapsed.value) {
          const multiEmailInputHeader = membersEl.value.querySelector(
            ".multi-email-input-header"
          );

          tween = gsap.to(membersGroupEl.value, {
            css: {
              height: `${
                (multiEmailInputHeader?.getBoundingClientRect().height || 0) +
                16
              }px`,
            },
            duration: 0.3,
            ease: "none",
          });
          return;
        }

        gsap.to(membersGroupEl.value, {
          css: {
            height: `${membersEl.value.getBoundingClientRect().height + 16}px`,
          },
          duration: 0.3,
          ease: "none",
          onComplete: () => {
            if (!membersGroupEl.value) return;

            membersGroupEl.value.classList.remove("overflow-hidden");
            membersGroupEl.value.removeAttribute("style");
          },
        });
      });
    }

    function onToggleCollapse() {
      isMembersGroupCollapsed.value = !isMembersGroupCollapsed.value;
    }

    watch(show, () => {
      if (!show.value) {
        projectName.value = "";
        projectNameInvalidFeedback.value = "";
      }
      isMembersGroupCollapsed.value = true;
      setupMembersGroupHeight();
    });
    watch(isMembersGroupCollapsed, () => {
      setupMembersGroupHeight();
    });

    onMounted(() => {
      setupMembersGroupHeight();
    });

    return {
      membersGroupEl,
      membersEl,
      projectName,
      projectNameInvalidFeedback,
      membersGroupHeight,
      isMembersGroupCollapsed,
      showProxy,
      shareUserRoleProxy,
      removeInputEmail,
      pasteEmails,
      enterEmail,
      onAddedShares,
      onUpdateMemberRole,
      onDeleteProjectShare,
      onClickedCancelSaveAsProject,
      onClickedSaveAsProject,
      onToggleCollapse,
    };
  },
});
</script>

<style lang="stylus" scoped>
.save-as-project-modal
  &-content
    @apply pb-2

    &-body
      @apply space-y-6

      .form-group--members
        @apply p-2 bg-bg-middle border-b border-primary-hover rounded-t

    &-shares
      @apply mt-6

      &-footer
        @apply mt-2 text-xs text-gray-3 text-right

    &-footer
      @apply mt-6 space-x-6 text-center

      .cancel-button
        @apply text-base text-gray-3

    &-notice
      @apply mt-3 text-sm text-gray-2 text-center
</style>
