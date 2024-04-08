<template lang="pug">
.chart
  ECharts(
    :loading="loading"
    :option="formatedOption"
    autoresize
    @click="onClicked"
    ref="chartComp"
  ).vchart
</template>

<script lang="ts">
import type { PropType } from "vue";
import axios from "axios";
import ECharts from "vue-echarts";
import { use } from "echarts/core";
import { registerMap } from "echarts/core";
import { MapChart } from "echarts/charts";
import "echarts-wordcloud";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { ECBasicOption } from "echarts/types/dist/shared";

use([
  MapChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  CanvasRenderer,
]);

const DefaultGrid = {
  top: 14,
  right: 0,
  bottom: 0,
  left: 30,
  containLabel: true,
};

const DefaultOption = {
  xAxis: {
    axisLine: {
      lineStyle: {
        color: "#828282",
      },
    },
  },
  yAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#828282",
      },
    },
    axisTick: {
      show: true,
    },
    splitLine: {
      lineStyle: {
        color: "#E5E6F4",
        opacity: 0.5,
      },
    },
  },
  tooltip: {
    padding: 16,
    textStyle: {
      color: "#4F4F4F",
      fontSize: 16,
      lineHeight: 21,
    },
  },
  grid: DefaultGrid,
};

export default defineComponent({
  name: "SLRegionsMapChart",
  components: {
    ECharts,
  },
  props: {
    option: {
      type: Object as PropType<ECBasicOption>,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const { option } = toRefs(props);

    const mapJsonLoaded = ref(false);

    const formatedOption = computed(() => {
      if (mapJsonLoaded.value) {
        return {
          ...DefaultOption,
          ...option.value,
        };
      }

      return {
        ...DefaultOption,
      };
    });

    function onClicked(e: any) {
      emit("click", e);
    }

    function loadMapJson() {
      axios
        .get("/assets/files/taiwan-regions.json")
        .then((response) => {
          const { data } = response;

          registerMap("TaiwanRegions", data);
          mapJsonLoaded.value = true;
        })
        .catch((e) => {
          console.log(e);
        });
    }

    onMounted(() => {
      loadMapJson();
    });

    return {
      formatedOption,
      onClicked,
    };
  },
});
</script>

<style lang="stylus">
.chart
  @apply h-52
</style>
