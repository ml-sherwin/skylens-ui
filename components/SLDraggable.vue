<template lang="pug">
component(
  :is="tag"
  :class="class"
  ref="draggableEl"
) ddd
</template>

<script lang="ts">
import type { PropType } from "vue";
import Sortable from "sortablejs";

export default defineComponent({
  name: "SLDraggable",
  components: {},
  props: {
    tag: {
      type: String,
      default: "div",
    },
    class: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    group: {
      type: String,
      default: "",
    },
    sort: {
      type: Boolean,
      default: true,
    },
    itemKey: {
      type: String,
      default: "id",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { modelValue, group, sort } = toRefs(props);

    const draggableEl = shallowRef<HTMLElement | null>(null);

    let sortable: Sortable | null = null;

    onMounted(() => {
      if (draggableEl.value) {
        const sortableOptions: Sortable.Options = {
          sort: sort.value,
          setData: (dataTransfer, dragEl) => {
            if (!draggableEl.value) {
              dataTransfer.clearData("element");
              return;
            }

            const elIndex = Array.from(draggableEl.value.children).indexOf(
              dragEl
            );

            if (elIndex === -1) {
              dataTransfer.clearData("element");
              return;
            }

            const element = modelValue.value[elIndex];

            if (element === undefined || element === null) {
              dataTransfer.clearData("element");
              return;
            }

            dataTransfer.setData("widget", JSON.stringify(element));
          },
          onAdd: (e) => {
            const elementIndex = e.newIndex;
            const originalEvent = e["originalEvent"];
            if (elementIndex === undefined || !originalEvent) return;

            const elementJson = originalEvent.dataTransfer.getData("widget");
            if (!elementJson) return;

            const element = JSON.parse(elementJson);

            if (modelValue.value.length === 0) {
              emit("update:modelValue", [
                ...modelValue.value.slice(0, elementIndex - 1),
                element,
                ...modelValue.value.slice(elementIndex - 1),
              ]);
            } else {
              emit("update:modelValue", [
                ...modelValue.value.slice(0, elementIndex),
                element,
                ...modelValue.value.slice(elementIndex),
              ]);
            }
          },
          onRemove: (e) => {
            if (e.oldIndex === undefined) return;

            emit("update:modelValue", [
              ...modelValue.value.slice(0, e.oldIndex),
              ...modelValue.value.slice(e.oldIndex + 1),
            ]);
          },
          onEnd: (e) => {
            if (
              e.newIndex === undefined ||
              e.oldIndex === undefined ||
              e.newIndex === e.oldIndex
            ) {
              return;
            }

            const element = modelValue.value[e.oldIndex];
            const newValue = [...modelValue.value];

            newValue.splice(e.oldIndex, 1);
            newValue.splice(e.newIndex, 0, element);
            emit("update:modelValue", newValue);
          },
        };

        if (group.value !== "") {
          sortableOptions.group = group.value;
        }

        sortable = new Sortable(draggableEl.value, sortableOptions);
      }
    });

    onBeforeUnmount(() => {
      if (sortable) {
        sortable.destroy();
      }

      sortable = null;
    });

    return {
      draggableEl,
    };
  },
});
</script>

<style lang="stylus"></style>
